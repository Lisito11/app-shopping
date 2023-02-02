import { ArrowBack } from '@mui/icons-material';
import { Autocomplete, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { ListBrand } from '../components/ListBrand';
import { ListProduct } from '../components/ListProduct';
import { MySnackbar } from '../components/MySnackbar';
import { AppLayout } from '../layout/AppLayout';
import productService from '../services/product.service';

export const ProductBrandPage = () => {


  //BACKEND
  const productStore = useStore(state => state.products);
  const brandStore = useStore(state => state.brands);
  const [brandsData, setBrandsData] = useState(brandStore);
  const [productsData, setProductsData] = useState(productStore);

  const [brandSelected, setBrandSelected] = useState('');
  const [productSelected, setProductSelected] = useState('');

  useEffect(() => {
    setProductsData(productStore.map(product => {
      const {id, name:label} = product;
      return {label, id};
    }));

  }, [productStore]);

  useEffect(() => {
    setBrandsData(brandStore.map(brand => {
      const {id, name:label} = brand;
      return {label, id};
    }));

  }, [brandStore]);

  //SNACKBAR
  const [openSnackbar, setOpenSnackbar] = useState({});
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({open:false});
  };

  // Create
  const createProductBrand = useMutation(({productSelected, brandSelected}) => {
      console.log(productSelected, brandSelected);
      return productService.addProducBrand(productSelected, brandSelected);
  });

  const addProductBrand = async () => {
    const isAnyFieldEmpty = !brandSelected || !productSelected;

    if (!isAnyFieldEmpty) {

      const {succeeded} = await createProductBrand.mutateAsync({productSelected, brandSelected});

      if(succeeded) {
        setOpenSnackbar({open:true, message: 'Producto añadido a la marca', severity: "success"})
      } else {
        setOpenSnackbar({open:true, message: 'Ha ocurrido un error', severity: "error"});
      }       
    } 
    else {
      setOpenSnackbar({open:true, message: 'Seleccione una marca y producto', severity: "error"});
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
      <Link to={"/"} className="text-link">
            <Chip icon={<ArrowBack />} label="Regresar" onClick={() => {}} />
          </Link>
        <Typography variant="h6" noWrap component="div" margin={2.4}> Configuración de supermercados </Typography>
      </Grid>

      <Grid item xs={12} sx={{ mb:5}}> 
      <Typography variant="h6" noWrap component="div" >Añadir productos a la Marca</Typography>
      
        <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, {id}) => {setBrandSelected(id)}}
        disablePortal
        options={brandsData}
        sx={{mt:3}}
        renderInput={(params) => <TextField {...params} label="Marcas" />}
        />
      <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, {id}) => {setProductSelected(id)}}
        disablePortal
        options={productsData}
        sx={{mt:3}}
        renderInput={(params) => <TextField {...params} label="Productos" />}
        />

      <Button variant='contained' color='secondary' sx={{mt:3}} fullWidth={true} onClick={addProductBrand}>Añadir producto a la marca</Button>

      </Grid>

      <Grid item xs={12}> 
      <Typography variant="h6" noWrap component="div" >Productos</Typography>
        <ListProduct/>
      </Grid>


      <Grid item xs={12} sx={{mt:5, mb:5}}> 
      <Typography variant="h6" noWrap component="div" >Marcas</Typography>
        <ListBrand/>
      </Grid>

    </Grid>

    </AppLayout>
  )
}
