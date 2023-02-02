import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useStore } from '../../store/store';
import authService from '../services/auth.service';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


export const RegisterPage = () => {

  const { register, handleSubmit} = useForm();
  const login = useStore(state => state.login);
  const [error, setError] = useState(false);

  const onSubmit = async (user) => {
    
    const {name, lastname, email, password} = user;

    console.log(password);
    authService.register(name, lastname, email, password)
    .then(({succeeded}) => {
      if (succeeded) {
        authService.login(email, password)
        .then(({succeeded}) => {
          if (succeeded) {
            login()
          } else {
            setError(true);
          }
        })
      }
    })
    .catch(() => {setError(true);})
    
  }


  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="false" >
          <Grid container>
           
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                required
                error={error}
                label="Nombres" 
                type="text" 
                placeholder='Nombres' 
                fullWidth
                {...register("name")}
              />
              
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
            <TextField 
                required
                error={error}
                label="Apellidos" 
                type="text" 
                placeholder='Apellidos' 
                fullWidth
                {...register("lastname")}

              />
              
            </Grid>

            

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
                  Crear cuenta
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
              <Link component={ RouterLink } color='inherit' to="/auth/login">
                ingresar
              </Link>
            </Grid>

          </Grid>


        </form>

    </AuthLayout>
  )
}
