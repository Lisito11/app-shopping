import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { MySnackbar } from './MySnackbar';
import shoppingItemListService from '../services/shoppingItemList.service';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';


export const ListPurchaseDetail = () => {

  //FILAS
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  //BACKEND
  const {id:shoppingListId} = useParams();
  const { status, data } = useQuery(['detailList', shoppingListId], () => shoppingItemListService.getByShoppingList(shoppingListId));

  useEffect(() => {
    if (status === 'success') {
        setRows(data.data.map(item => {
            const {shoppingDetailListId:id, brand, name, price, quantity, superMarketProductBrandId} = item;
            return {id, brand, name, price, quantity, superMarketProductBrandId, total:0};
        }));  
    }
  }, [status, data]);

    // Delete
    const remove = useMutation((id) => {
        return shoppingItemListService.delete(id);
    });

    // Update
    const update = useMutation(({name, brand, shoppingListId, superMarketProductBrandId, quantity, price, id}) => {
        return shoppingItemListService.update(name, brand, shoppingListId, superMarketProductBrandId, quantity, price, id);
    });
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
  };

  const processRowUpdate = async (newRow) => {
    //backend
    let updatedRow = { ...newRow, isNew: false };
    const {name, brand, superMarketProductBrandId, quantity, price, id} = updatedRow;

    if (!quantity) {
        setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
        return handleCancelClick(id);
    } 
    console.log(updatedRow);
    const result =  await update.mutateAsync({name, brand, shoppingListId, superMarketProductBrandId, quantity, price, id});
    if (result == 204) {
        setOpenSnackbar({open:true, message: 'Producto editado', severity: "info"});
    }   
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };


  const columns = [
    { field: "name", headerName: "Producto", width: 350 },
    { field: "brand", headerName: "Marca", width: 250},
    { field: "price", headerName: "Precio", width: 150, type: 'number'},
    { field: "quantity", headerName: "Cantidad", width: 150, type: 'number', editable: true },
    { 
        field: "total", 
        headerName: "Total", 
        width: 150, 
        type: 'number',
        valueGetter: (params) => params.row.price * params.row.quantity,
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 200,
        cellClassName: 'actions',
        getActions: ({ id }) => {
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

  return (
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
        experimentalFeatures={{ newEditingApi: true }}
    />
    </div>
  );

 

//  const columns = [
//     { field: "name", headerName: "Nombre", width: 200 },
//     { field: "brand", headerName: "Marca", width: 250},
//     { field: "price", headerName: "Precio", width: 300},
//     { field: "quantity", headerName: "Cantidad", width: 300},
//     { field: "total", headerName: "Total", width: 300},
// ];

// const rows = [
//     { id:'1', name: "Jugo de manzana", brand: "Rica", price:"1",  quantity:"500",  total: "1000"},
//     { id:'2', name: "Jugo de manzana", brand: "Rica", price:"1",  quantity:"500",  total: "1000"},
//     { id:'3', name: "Jugo de manzana", brand: "Rica", price:"1",  quantity:"500",  total: "1000"},
//     { id:'4', name: "Jugo de manzana", brand: "Rica", price:"1",  quantity:"500",  total: "1000"},
//     { id:'5', name: "Jugo de manzana", brand: "Rica", price:"1",  quantity:"500",  total: "1000"},
// ];




}
