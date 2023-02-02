import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { LogoutOutlined, MenuOutlined, ShoppingCart } from '@mui/icons-material';
import authService from '../../auth/services/auth.service';
import { useStore } from '../../store/store';


export const NavBar = ({ drawerWidth = 240 }) => {


    const logoutUser = useStore(state => state.logout);

    const logout = () => {
        authService.logout();
        logoutUser();
    }

    return (
        <AppBar 
            position='fixed'
            sx={{ 
                width: { sm: `calc(100% - ${ drawerWidth }px)` },
                ml: { sm: `${ drawerWidth }px` }
            }}
        >
            <Toolbar>
                <IconButton
                    color='inherit'
                    edge="start"
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuOutlined />
                </IconButton>

                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap component='div'> App Compras </Typography>

                    <IconButton style={{color:"white"}} onClick={logout}>
                        <LogoutOutlined />
                    </IconButton>
                </Grid>

            </Toolbar>
        </AppBar>
    )
}
