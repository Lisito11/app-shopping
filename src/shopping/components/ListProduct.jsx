import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MySnackbar } from './MySnackbar';
import { useStore } from '../../store/store';
import productService from '../services/product.service';

const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;
    
    const handleClick = () => {
      
      const id = 1;
      setRows((oldRows) => [...oldRows, { id, name: '', brand:"", description: '', isNew: true }]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));

    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          Añadir producto
        </Button>
      </GridToolbarContainer>
    );
}
  
EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setRows: PropTypes.func.isRequired,
};

export const ListProduct = () => {

  //FILAS
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  //BACKEND
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const removeProduct = useStore(state => state.removeProduct);
  const removeAllProduct = useStore(state => state.removeAllProduct);

  // Get ALL
  const { status, data } = useQuery(['product'], productService.getAll);

  // Delete
  const remove = useMutation((id) => {
    return productService.delete(id);
  });

  // Create
  const create = useMutation(({name, description}) => {
      return productService.create(name, description);
  });

  // Update
  const update = useMutation(({name, description, id}) => {
    return productService.update(name, description, id);
  });
   
  useEffect(() => {
    if (status === 'success') {
      removeAllProduct();
      const productsFormatted = data.data.map(product => {
        const {productId:id, name, description} = product;
        addProduct({id, name, description})
        return {id, name, description};
      });
      setRows(productsFormatted);
      
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
    setOpenSnackbar({open:true, message: 'Producto eliminado', severity: "warning"});
    setRows(rows.filter((row) => row.id !== id));
    removeProduct(id)
  };

  const processRowUpdate = async (newRow) => {
    //backend
    const isCreate = newRow.isNew;
    let updatedRow = { ...newRow, isNew: false };
    const {name, description, id} = updatedRow;
    const isAnyFieldEmpty = !name || !description;


    if (isCreate) {
      if (isAnyFieldEmpty) {
        setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
        return handleCancelClick(id);
      } 
      const {data, succeeded} = await create.mutateAsync({name, description});
      if (succeeded) {
        updatedRow = { ...updatedRow, id: data.productId };
        const {id} = updatedRow;
        addProduct({name, description, id});
        setOpenSnackbar({open:true, message: 'Producto creado', severity: "success"});
      }

    } else {
      if (isAnyFieldEmpty) {
        setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
        return handleCancelClick(id);
      } 
      const result =  await update.mutateAsync({name, description, id});
      updateProduct({name, description, id})
      if (result == 204) {
        setOpenSnackbar({open:true, message: 'Producto editado', severity: "info"});
      }
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', width: 280, editable: true },
    { field: 'description', headerName: 'Descripción', width: 550, editable: true },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id}) => {
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


// const columnsProducts = [
//     { field: "name", headerName: "Nombre", width: 200 },
//     { field: "brand", headerName: "Marca", width: 250},
//     { field: "description", headerName: "Descripcion", width: 300},
//   ];

//   const rowsProducts = [
//     { id:'1', name: "Jugo de manzana", brand: "Rica", description:"Este es un producto" },
//     { id:'2', name: "Jugo de pera", brand: "Rica", description:"Este es un producto" },
//     { id:'3', name: "Jugo de naranja", brand: "Rica", description:"Este es un producto" },
//     { id:'3', name: "Jugo de naranja", brand: "Rica", description:"Este es un producto" },
//     { id:'3', name: "Jugo de naranja", brand: "Rica", description:"Este es un producto" },
//   ];