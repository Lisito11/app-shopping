import { Link as RouterLink } from 'react-router-dom';
import { Button, FormControl, FormHelperText, Grid, Link, TextField } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from 'react-hook-form';
import authService from '../services/auth.service';
import { useStore } from '../../store/store';
import { useState } from 'react';


export const LoginPage = () => {

  const { register, handleSubmit} = useForm();
  const login = useStore(state => state.login);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const onSubmit = async (user) => {
    
    const {email, password} = user;
    const {succeeded} = await authService.login(email, password)
    if (succeeded) {
      login()
    } else {
      setError(true);
    }
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="false" >
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                required
                error={error}
                label="Correo" 
                type="email" 
                placeholder='correo@google.com' 
                fullWidth
                {...register("email")}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                required
                error={error}
                label="Contraseña" 
                type="password" 
                placeholder='Contraseña' 
                fullWidth
                {...register("password")}
              />
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 }>
                <Button variant='contained' fullWidth type='submit'>
                  Login
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Link component={ RouterLink } color='inherit' to="/auth/register">
                Crear una cuenta
              </Link>
            </Grid>

          </Grid>


        </form>

    </AuthLayout>
  )
}
