import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Category, ExpandLess, ExpandMore, Home, Logout, Settings, ShoppingBag, StarBorder, Store } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import authService from "../../auth/services/auth.service";
import { useEffect } from "react";


export const SideBar = ({ drawerWidth = 240 }) => {
  
  //BACKEND
  const getCurrentUser = useStore(state => state.getCurrentUser);
  const {userName, roleName} = useStore(state => state.user);
  const logoutUser = useStore(state => state.logout);

  useEffect(() => {
    getCurrentUser()
  }, [userName])
  

  const logout = () => {
    authService.logout();
    logoutUser();
  }
  //-----------

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const menuOptions = [
    {
      text: "Inicio",
      icon: <Home />,
      link: '/'
    },
    {
      text: "Supermercados",
      icon: <Store />,
      link: '/supermarkets'
    },
    {
      text: "Mis compras",
      icon: <ShoppingBag />,
      link: '/purchases'
    }
  ];
  const menuOptionsAdmin = [
    {
      text: "Supermercados",
      icon: <Store />,
      link: '/setting/supermarkets'
    },
    {
      text: "Marcas y Productos",
      icon: <Category />,
      link: '/setting/products-brands'
    },
  ];

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent" // temporary
        open
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Toolbar>
          <Grid container spacing={1} direction='row' justifyContent='start' alignItems='center'>
          <Avatar sx={{ width: 35, height: 35, backgroundColor:'#fc0356'}}>{userName[0]}</Avatar >
          <Typography variant="h6" noWrap component="div" margin={2.4}>
            {userName}
          </Typography>
          </Grid>
        </Toolbar>

        <Divider />
        <List>
            {menuOptions.map((opt) => (
              <Link key={opt.text} to={opt.link} className='text-link'>
              <ListItem key={opt.text} disablePadding>
                
                  <ListItemButton >
                    <ListItemIcon>{opt.icon}</ListItemIcon>
                    <Grid container>
                      <ListItemText primary={opt.text} />
                    </Grid>
                  </ListItemButton>
              </ListItem>
              </Link>

            ))}


            {
                roleName == "ADMIN" 
                ? ( <>
                  <ListItem key={"Configuracion"} disablePadding>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <Settings/>
                        </ListItemIcon>
                        <Grid container>
                        <ListItemText primary={"Configuración"} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                        </Grid>
                    </ListItemButton>
                </ListItem>

                <Collapse key={'collapse'} in={open} timeout="auto" unmountOnExit>
                  <List key={'list-admin'} component="div" disablePadding>
                  {menuOptionsAdmin.map((opt) => (
                  <Link key={`config-${opt.text}`} to={opt.link} className='text-link'>
                    <ListItem key={`config-${opt.text}`} disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>{opt.icon}</ListItemIcon>
                        <Grid container>
                          <ListItemText primary={opt.text} />
                        </Grid>
                      </ListItemButton>
                    </ListItem>
                    </Link>

                  ))}
                  </List>
                </Collapse>
                </>
                ) 
                : ""
            }
          

          <ListItem key={'salir'} disablePadding>
                <ListItemButton onClick={logout}>
                  <ListItemIcon><Logout/></ListItemIcon>
                  <Grid container>
                    <ListItemText primary={"Salir"}  />
                  </Grid>
                </ListItemButton>
              </ListItem>

        </List>
        
    
      </Drawer>
    </Box>
  );
};
