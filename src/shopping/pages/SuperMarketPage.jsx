import {
  ArrowBack,
  ShoppingBag,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import { AppLayout } from "../layout/AppLayout";
import supermarketService from "../services/supermarket.service";

export const SuperMaketPage = () => {

  //BACKEND
  const addSuperMarket = useStore(state => state.addSupermarket);
  const removeAll = useStore(state => state.removeAllSupermarket);
  const [supermarkets, setSupermarkets] = useState([]);
  const { status, data } = useQuery(['supermarket'], supermarketService.getAll);

  useEffect(() => {
    if (status === 'success') {
      removeAll();
      const supermarketsFormatted = data.data.map(supermarket => {
        const {superMarketId:id, name, slogan, description, superMarketProductBrands} = supermarket;
        const products = superMarketProductBrands.length;
        addSuperMarket({id, name, slogan, description})
        return {id, name, slogan, description, products};
      });
      setSupermarkets(supermarketsFormatted);
    }
  }, [status, data]);
  //BACKEND

  
  // const supermarkets = [
  //   {
  //     id: "1",
  //     name: "La Sirena",
  //     slogan: "Mas de una emoción",
  //     description: "...",
  //     products: "15",
  //   },
  //   {
  //     id: "1",
  //     name: "Jumbo",
  //     slogan: "La calidad no cuesta más",
  //     description: "...",
  //     products: "15",
  //   },
  //   {
  //     id: "1",
  //     name: "Iberia",
  //     slogan: "¡La Primera!",
  //     description: "...",
  //     products: "15",
  //   },
  //   {
  //     id: "1",
  //     name: "Bravo",
  //     slogan: "¡Los expertos en vender barato!",
  //     description: "...",
  //     products: "15",
  //   },
  // ];

  return (
    <AppLayout>
      <Grid container>
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to={"/"} className="text-link">
            <Chip icon={<ArrowBack />} label="Regresar" onClick={() => {}} />
          </Link>

          <Typography variant="h6" noWrap component="div" margin={2.4}>
            Supermercados 🛒
          </Typography>
        </Grid>

        <Grid container spacing={3} justifyContent="start" alignItems="center">
          {supermarkets.map(
            ({ id, name, slogan, products }, index) => (
              <Grid item xs={3} key={index}>
                <Card>
                  <CardContent>
                    
                    <Typography variant="h6" component="div">
                      {name}
                    </Typography>
                    
                    <div>
                      <Chip label={slogan} size="small" variant="outlined" color='primary' sx={{ mb: 5 }}/>
                    </div>
                    
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img src="/assets/supermarket.svg" width={150}></img>
                    </Grid>

                    <Chip
                      icon={<ShoppingBag />}
                      
                      sx={{ mt: 5, mr: 1 }}
                      label={`${products} productos disponibles`}
                    />

                  </CardContent>
                  <CardActions>
                    <Link to={`/shopping/${id}`} className="text-link">
                      <Button color="secondary" sx={{ mr: 2 }}>
                        Iniciar Compra
                      </Button>


                      {/* <IconButton aria-label="edit" color="info">
                        <Edit />
                      </IconButton>
                      <IconButton aria-label="delete" color="error">
                        <Delete />
                      </IconButton> */}


                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </AppLayout>
  );
};
