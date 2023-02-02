import { ArrowBack } from '@mui/icons-material';
import { Autocomplete, Button, Chip, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { ListSuperMarket } from '../components/ListSuperMarket';
import { MySnackbar } from '../components/MySnackbar';
import { AppLayout } from '../layout/AppLayout';
import productService from '../services/product.service';
import supermarketService from '../services/supermarket.service';

export const SuperMarketPageConfig = () => {

  //BACKEND
  const superMarkets = useStore(state => state.supermarkets);
  const [superMarketsData, setSuperMarketsData] = useState(superMarkets);
  const [productbrandData, setProductbrandData] = useState([]);
  const [productSupermarket, setProductSupermarket] = useState({});
  const [productRemoveSupermarket, setProductRemoveSupermarket] = useState({});
  const [productsRemoveSupermarket, setProductsRemoveSupermarket] = useState([]);
  const {status, data} = useQuery(['productbrand'], productService.getAllProductBrands);

  useEffect(() => {
    setSuperMarketsData(superMarkets);
  }, [superMarkets]);

  useEffect(() => {
    if (status === 'success') {
      setProductbrandData(data.data.map(pb => {
        const {brand, product, productBrandId} = pb
        return {brand, product, productBrandId}
      }))
    }
  }, [status, data]);

  const options = productbrandData.map((option) => {
    const firstLetter = option.brand.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  const optionsRemove = productsRemoveSupermarket.map((option) => {
    const firstLetter = option.productBrand.brand.name[0].toUpperCase();
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
  const createProductSupermarket = useMutation(({superMarketId, productBrandId, price}) => {
      return supermarketService.addProductSupermarket(superMarketId, productBrandId, price);
  });

  const deleteProduct = useMutation((id) => {
    return supermarketService.deleteProductSupermarket(id);
  });

  const addProductSupermarket = async () => {

    const {superMarketId, productBrandId, price} = productSupermarket;
    const isAnyFieldEmpty = !superMarketId || !productBrandId || !price;
    if (!isAnyFieldEmpty) {
      const {succeeded} = await createProductSupermarket.mutateAsync(productSupermarket);
      if(succeeded) {
        setOpenSnackbar({open:true, message: 'Producto añadido al supermercado', severity: "success"})
      } else {
        setOpenSnackbar({open:true, message: 'Ha ocurrido un error', severity: "error"});
      }       
    } 
    else {
      setOpenSnackbar({open:true, message: 'Seleccione una marca y producto', severity: "error"});
    }
      
  }

  const deleteProductSupermarket = async () => {
   const {superMarketProductBrandId:id} = productRemoveSupermarket
   console.log(id);
   if (id) {
      await deleteProduct.mutateAsync(id);
      setOpenSnackbar({open:true, message: 'Producto eliminado', severity: "warning"})     
    } 
    else {
      setOpenSnackbar({open:true, message: 'Seleccione un producto', severity: "error"});
    }
      
  }

  const handleSupermarket = async (id) =>{
    const {data} = await supermarketService.getProductsBySupermarket(id);
    console.log(data);
    setProductsRemoveSupermarket(data);    
  };


  // const supermarkets = [
  //   { label: 'La sirena', id: 1 },
  //   { label: 'Jumbo', id: 2 },
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
      <Link to={"/"} className="text-link">
            <Chip icon={<ArrowBack />} label="Regresar" onClick={() => {}} />
          </Link>
        <Typography variant="h6" noWrap component="div" margin={2.4}> Configuración de supermercados </Typography>
      </Grid>


      <Grid item xs={12} sx={{ mb:5}}> 

        <Typography variant="h6" noWrap component="div" >Añadir productos a un supermercado</Typography>
        <Autocomplete
          disablePortal
          getOptionLabel={(option) => option.name}
          onChange={(e, {id}) => {setProductSupermarket(state => ({...state, superMarketId:id}))}}
          id="supermarkets-select"
          options={superMarketsData}
          sx={{mt:3}}
          renderInput={(params) => <TextField {...params} label="Supermercados" />}
          />

        <Autocomplete
              onChange={(e, {productBrandId}) => {setProductSupermarket(state => ({...state, productBrandId}))}}
              id="productbrand-data"
              sx={{mt:3}}
              disablePortal
              options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) ?? []}
              groupBy={(option) => option.brand.name}
              getOptionLabel={(option) => option.product.name}
              renderInput={(params) => <TextField {...params} label="Productos" />}
            />

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel htmlFor="price">Precio</InputLabel>
            <OutlinedInput
              onChange={({target}) => {setProductSupermarket(state => ({...state, price: target.value}))}}
              id="price"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Precio"
            />
          </FormControl>

        <Button variant='contained'  color='secondary' sx={{mt:3}} fullWidth={true} onClick={addProductSupermarket}>Añadir producto al supermercado</Button>

      </Grid>
      




      <Grid item xs={12}> 
        <Typography variant="h6" noWrap component="div" >Supermercados</Typography>
        <ListSuperMarket/>
      </Grid>

      <Grid item xs={12} sx={{mt:5, mb:10}}> 

        <Typography variant="h6" noWrap component="div" >Eliminar productos del supermercado</Typography>
        <Autocomplete
          disablePortal
          getOptionLabel={(option) => option.name}
          onChange={(e, {id}) => {handleSupermarket(id)}}
          id="supermarkets-select"
          options={superMarketsData}
          sx={{mt:3}}
          renderInput={(params) => <TextField {...params} label="Supermercados" />}
          />

        <Autocomplete
              onChange={(e, data) => {setProductRemoveSupermarket(data)}}
              id="productbrand-data"
              sx={{mt:3}}
              disablePortal
              options={optionsRemove.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) ?? []}
              groupBy={(option) => (option.productBrand.brand.name ?? "")}
              getOptionLabel={(option) => option.productBrand.product.name}
              renderInput={(params) => <TextField {...params} label="Productos" />}
            />

        <Button variant='outlined'  color='secondary' sx={{mt:3}} fullWidth={true} onClick={deleteProductSupermarket}>Eliminar producto del supermercado</Button>

    </Grid>

    </Grid>

    </AppLayout>
  )
}
