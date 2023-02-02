import { ArrowBack, AttachMoney, Money } from '@mui/icons-material';
import { Autocomplete, Button, Chip, FormControl, Grid, Input, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/store';
import { ListShopping } from '../components/ListShopping';
import { MySnackbar } from '../components/MySnackbar';
import { AppLayout } from '../layout/AppLayout';
import shoppingItemListService from '../services/shoppingItemList.service';
import shoppingListService from '../services/shoppingList.service';
import supermarketService from '../services/supermarket.service';

export const ShoppingPage = () => {

  //BACKEND
  const {supermarketid} = useParams();
  const navigate = useNavigate();
  const {status, data} = useQuery(['productbrandsupermarket', supermarketid], () => supermarketService.getProductsBySupermarket(supermarketid));
  const [productsData, setProductsData] = useState([]);
  const [productSelected, setProductSelected] = useState({product: {price:0}});
  const addItem = useStore(state => state.addItem);
  const removeAllItem = useStore(state => state.removeAllItem);
  const itemsStore = useStore(state => state.items);
  const {userId} = useStore(state => state.user);


  const createList = useMutation(({supermarketid, userId, dateCreated}) => {
    return shoppingListService.create(supermarketid, userId, dateCreated);
  });

  const createItemList = useMutation(({name, brand, shoppingListId, superMarketProductBrandId, quantity, price}) => {
    return shoppingItemListService.create(name, brand, shoppingListId, superMarketProductBrandId, quantity, price);
  });


  useEffect(() => {
    if (status === 'success') {
      setProductsData(data.data.map(pb => {
        const {superMarketProductBrandId, productBrand, price} = pb
        const {product, brand} = productBrand;
        return {brand, product, price, superMarketProductBrandId}
      }))
    }
  }, [status, data]);

  const options = productsData.map((option) => {
    const firstLetter = option.brand.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });


  //SNACKBAR
  const [openSnackbar, setOpenSnackbar] = useState({});
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({open:false});
  };

    // Create

  const addProductShoppingList = async () => {
    
    const {product:{brand:{name:nameBrand}, product:{name:nameProduct}, superMarketProductBrandId:id, price}, quantity} = productSelected;
    const item = {id, nameBrand, nameProduct, price, quantity}
    const isAnyFieldEmpty =  !nameProduct || !price || !quantity;

    if (!isAnyFieldEmpty) {
      addItem(item)
      setOpenSnackbar({open:true, message: 'Producto añadido a la lista de compra', severity: "success"})   
    } 
    else {
      setOpenSnackbar({open:true, message: 'Complete todos los campos', severity: "error"});
    }
      
  }

  const finishShopping = async () => {
    if (itemsStore.length) {
       const date = new Date();
       const dateCreated = moment(date).format('YYYY-MM-DDTHH:mm:ss');
       const list = {supermarketid, userId, dateCreated}
       const {data, succeeded} = await createList.mutateAsync(list);
       if (succeeded) {
          const {shoppingListId} = data;
          for (const item of itemsStore) {
            const {id:superMarketProductBrandId, nameBrand:brand, nameProduct:name, price, quantity} = item;
            await createItemList.mutateAsync({name, brand, shoppingListId, superMarketProductBrandId, quantity, price});
          }
          setOpenSnackbar({open:true, message: 'Lista terminada!', severity: "success"});  
          removeAllItem()
          navigate('/purchases');
       }
    } 
    else {
      setOpenSnackbar({open:true, message: 'Añada minimo un producto a la lista', severity: "error"});
    }
  }

  // const brands = [
  //   { label: 'Rica', id: 1 },
  //   { label: 'Petit', id: 2 },
  // ];

  // const products = [
  //   { label: 'Jugo de naranja', id: 1 },
  //   { label: 'Jugo de pera', id: 2 },
  // ];

  return (
    <AppLayout>
      
    <Grid container spacing={2}>

    <MySnackbar open={openSnackbar.open} message={openSnackbar.message} severity={openSnackbar.severity} handleClose={handleClose}/>

      <Grid container spacing={1} direction='row' justifyContent='space-between' alignItems='center' margin={1}>
      <Link to={"/supermarkets"} className="text-link">
            <Chip icon={<ArrowBack />} label="Regresar" onClick={() => {removeAllItem()}} />
          </Link>
      </Grid>

      <Grid item xs={12} sx={{ mb:5}}> 
      <Typography variant="h6" noWrap component="div" >Añadir productos a la lista de compra</Typography>


      <Autocomplete
              onChange={(e, product) => {setProductSelected((state) => ({...state, product}))}}
              id="products-data"
              sx={{mt:3}}
              disablePortal
              options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) ?? []}
              groupBy={(option) => option.brand.name}
              getOptionLabel={(option) => option.product.name}
              renderInput={(params) => <TextField {...params} label="Productos" />}
            />


        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Precio</InputLabel>
          <OutlinedInput
            value={productSelected.product.price}
            readOnly={true}
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Precio"
          />
        </FormControl>

        

       <TextField 
       onChange={({target}) => {setProductSelected(state => ({...state, quantity: +target.value}))}}
       id="quantity-data" 
       label="Cantidad" 
       variant="outlined" 
       fullWidth={true} 
       margin="normal"/>


      <Button variant='outlined'  color='secondary' sx={{mt:3}} fullWidth={true} onClick={addProductShoppingList}>Añadir producto</Button>
      <Button variant='contained'  color='secondary' sx={{mt:1}} fullWidth={true} onClick={finishShopping}>Terminar Lista</Button>

      </Grid>

     
      <Grid item xs={12} sx={{mb:10}}> 
      <Typography variant="h6" noWrap component="div" >Lista de compra</Typography>
        <ListShopping/>
        
      </Grid>



    </Grid>

    </AppLayout>
  )
}
