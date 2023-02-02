import { ShoppingBag } from '@mui/icons-material';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { AppLayout } from '../layout/AppLayout';

export const HomePage = () => {


  const getCurrentUser = useStore(state => state.getCurrentUser);
  
  const {userName} = useStore(state => state.user);

  useEffect(() => {
    getCurrentUser()
  }, [userName])
  
  return (
    <AppLayout>
      
    <Grid container>

      <Grid container spacing={1} direction='row' justifyContent='space-between' alignItems='center'>
      <Link to={"/purchases"} className="text-link">

        <Chip icon={<ShoppingBag/>} label="Compras" onClick={() => {}}/>
        </Link>
        <Typography variant="h6" noWrap component="div" margin={2.4}> Saludos, {userName} 👋</Typography>
      </Grid>
          
      <Grid container direction='row' justifyContent='center' alignItems='center' margin={5}>
        <Button>
          <img src='/assets/banner.svg' width={500}></img>
        </Button>
      </Grid>

      <Grid container direction='row' justifyContent='center' alignItems='center' margin={5}>
        <Link to={'/supermarkets'} className='text-link'>
          <Button variant="contained" color='secondary' size='large'>Ir a comprar</Button>
        </Link>
      </Grid>


    </Grid>

    </AppLayout>
  )
}
