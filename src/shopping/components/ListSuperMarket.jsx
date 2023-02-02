import { DataGrid, GridActionsCellItem, GridCellEditStopReasons, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, CircularProgress, Snackbar } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import supermarketService from '../services/supermarket.service';
import { MySnackbar } from './MySnackbar';
import { useStore } from '../../store/store';

const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;
    
    const handleClick = () => {
      
      const id = 1;
      setRows((oldRows) => [...oldRows, { id, name: '', slogan:'', description: '', isNew: true }]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));

    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          Añadir supermercado
        </Button>
      </GridToolbarContainer>
    );
}
  
EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};

export const ListSuperMarket = () => {

  //FILAS
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  //BACKEND
  const addSuperMarket = useStore(state => state.addSupermarket);
  const updateSuperMarket = useStore(state => state.updateSupermarket);
  const removeSuperMarket = useStore(state => state.removeSupermarket);
  const removeAll = useStore(state => state.removeAllSupermarket);

  // Get ALL
  const { status, data } = useQuery(['supermarket'], supermarketService.getAll);

  // Delete
  const remove = useMutation((id) => {
    return supermarketService.delete(id);
  });

  // Create
  const create = useMutation(({name, slogan, description}) => {
      return supermarketService.create(name, slogan, description);
  });

  // Update
  const update = useMutation(({name, slogan, description, id}) => {
    return supermarketService.update(name, slogan, description, id);
  });
   
  useEffect(() => {
    if (status === 'success') {
      removeAll();
      const supermarketsFormatted = data.data.map(supermarket => {
        const {superMarketId:id, name, slogan, description} = supermarket;
        addSuperMarket({id, name, slogan, description})
        return {id, name, slogan, description};
      });
      setRows(supermarketsFormatted);
      
    }
  }, [status, data]);

  //-------

  //SNACKBAR
  const [openSnackbar, setOpenSnackbar] = useState({});
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({open:false});
  };

  const handleRowEditStart = (params, event) => { event.defaultMuiPrevented = true;};

  const handleRowEditStop = (params, event) => {event.defaultMuiPrevented = true;};

  const handleEditClick = (id) => () => {setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });};

  const handleSaveClick = (id) => () => {  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });};

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick =  (id) => async () => {
    //BACKEND
    await remove.mutateAsync(id);
    setOpenSnackbar({open:true, message: 'Supermercado eliminado', severity: "warning"});
    setRows(rows.filter((row) => row.id !== id));
    removeSuperMarket(id)
  };

  const processRowUpdate = async (newRow) => {
    //backend
    const isCreate = newRow.isNew;
    let updatedRow = { ...newRow, isNew: false };
    const {name, slogan, description, id} = updatedRow;
    const isAnyFieldEmpty = !name || !slogan || !description;


    if (isCreate) {
      if (isAnyFieldEmpty) {
        setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
        return handleCancelClick(id);
      } 
      const {data, succeeded} = await create.mutateAsync({name, slogan, description});
      if (succeeded) {
        updatedRow = { ...updatedRow, id: data.superMarketId };
        const {id} = updatedRow;
        addSuperMarket({name, slogan, description, id});
        setOpenSnackbar({open:true, message: 'Supermercado creado', severity: "success"});
      }

    } else {
      if (isAnyFieldEmpty) {
        setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
        return handleCancelClick(id);
      } 
      const result =  await update.mutateAsync({name, slogan, description, id});
      updateSuperMarket({name, slogan, description, id})
      if (result == 204) {
        setOpenSnackbar({open:true, message: 'Supermercado editado', severity: "info"});
      }
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', width: 280, editable: true },
    { field: 'slogan', headerName: 'Slogan', width: 380, editable: true },
    { field: 'description', headerName: 'Descripción', width: 550, editable: true },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
            return [
            <GridActionsCellItem
                color='success'
                icon={<Save />}
                label="Save"
                onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
                color='error'
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
            />,
            ];
        }

        return [
            <GridActionsCellItem
            icon={<Edit/>}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color='primary'
            />,
            <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color='error'
            />,
        ];
        },
    },
  ];

  return status === 'success' ? (
    
    <div style={{ width: '100%' }}>
       
       <MySnackbar open={openSnackbar.open} message={openSnackbar.message} severity={openSnackbar.severity} handleClose={handleClose}/>

       <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  ) : (<CircularProgress/>);
}


