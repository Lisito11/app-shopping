import {
  ArrowBack,
  Delete,
  Edit,
  Paid,
  ShoppingBag,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";
import { MySnackbar } from "../components/MySnackbar";
import { AppLayout } from "../layout/AppLayout";
import shoppingListService from "../services/shoppingList.service";

export const PurchasePage = () => {


  //BACKEND
  // const listStore = useStore(state => state.lists);
  const {userId, userName} = useStore(state => state.user);
  const [purchases, setPurchases] = useState([]);
  const {status, data} = useQuery(['purchases', userId], () => shoppingListService.getAllByUser(userId));


  useEffect(() => {
    if (status === 'success') {
      setPurchases(data.data.map(purchase => {
         const {shoppingListId, created, superMarket:{name:supermarket}, shoppingDetailLists} = purchase;
         let total = 0;
         shoppingDetailLists.forEach(product => {
            const {price, quantity} = product;
            total += price * quantity;
         });
         const date = new Date(created).toDateString();
         const products = shoppingDetailLists.length;
         return {shoppingListId, date, supermarket, shoppingDetailLists, total, products};
      }));
    }
  }, [status, data]);

  //SNACKBAR
  const [openSnackbar, setOpenSnackbar] = useState({});
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar({open:false});
  };

  const remove = useMutation((id) => {
    return shoppingListService.delete(id);
  });


  const deleteList = (id) => async () => {
    await remove.mutateAsync(id);
    setPurchases(() => ([...purchases.filter((purchase) => purchase.shoppingListId !== id)]) );
    setOpenSnackbar({open:true, message: 'Lista de compra eliminada', severity: "warning"})
  }

  //BACKEND



  // const listShopping = [
  //   {
  //     id: "1",
  //     user: "Lisanny",
  //     supermarket: "La Sirena",
  //     date: "24-01-2023",
  //     total: "2500",
  //     quantity: "10",
  //   },
  //   {
  //     id: "1",
  //     user: "Lisanny",
  //     supermarket: "Jumbo",
  //     date: "21-01-2023",
  //     total: "4500",
  //     quantity: "12",
  //   },
  //   {
  //     id: "1",
  //     user: "Lisanny",
  //     supermarket: "El Nacional",
  //     date: "20-01-2023",
  //     total: "2800",
  //     quantity: "3",
  //   },
  //   {
  //     id: "1",
  //     user: "Lisanny",
  //     supermarket: "La Sirena",
  //     date: "22-01-2023",
  //     total: "2500",
  //     quantity: "4",
  //   },
  //   {
  //     id: "1",
  //     user: "Lisanny",
  //     supermarket: "La Sirena",
  //     date: "25-01-2023",
  //     total: "2700",
  //     quantity: "6",
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
            Mis compras 🛍
          </Typography>
        </Grid>
        <MySnackbar open={openSnackbar.open} message={openSnackbar.message} severity={openSnackbar.severity} handleClose={handleClose}/>

        <Grid container spacing={3} justifyContent="start" alignItems="center">
          {purchases.map(
            ({ shoppingListId, supermarket, date, total, products }, index) => (
              <Grid item xs={3} key={shoppingListId}>
                <Card>
                  <CardContent>
                    <Chip
                      label={`Compra #${index + 1}`}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 2, mr: 1 }}
                    />
                    <Chip
                      label={userName}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <Typography variant="h6" component="div">
                      {supermarket}
                    </Typography>
                    <div>
                      <Chip label={date} size="small" />
                    </div>

                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img src="/assets/purchase.svg" width={150}></img>
                    </Grid>

                    <Chip
                      icon={<ShoppingBag />}
                      sx={{ mt: 5, mr: 1 }}
                      label={`${products} productos`}
                    />

                    <Chip
                      icon={<Paid />}
                      sx={{ mt: 5, color: "white", fontWeight: "bold" }}
                      color="success"
                      label={`RD$${total}`}
                    />
                  </CardContent>
                  <CardActions>
                  <Grid container spacing={1} justifyContent="space-between" alignItems="start">

                    <Grid item> 
                    <Link to={shoppingListId} className="text-link">
                      <Button color="primary" fullWidth sx={{  }}>
                        Ver productos
                      </Button>
                    </Link>
                    </Grid>

                    <Grid item> 

                    <IconButton aria-label="delete" color="error" onClick={deleteList(shoppingListId)}>
                        <Delete />
                      </IconButton>
                    </Grid>

                    </Grid>

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

// {listShopping.map(
//   ({ id, user, supermarket, date, total, quantity }, index) => (
//     <Grid item xs={3}>
//       <Card>
//         <CardContent>
//           <Chip
//             label={`Compra #${index + 1}`}
//             size="small"
//             variant="outlined"
//             sx={{ mb: 2, mr: 1 }}
//           />
//           <Chip
//             label={user}
//             size="small"
//             variant="outlined"
//             sx={{ mb: 2 }}
//           />

//           <Typography variant="h6" component="div">
//             {supermarket}
//           </Typography>
//           <div>
//             <Chip label={date} size="small" />
//           </div>

//           <Grid
//             container
//             spacing={1}
//             direction="row"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <img src="/assets/purchase.svg" width={150}></img>
//           </Grid>

//           <Chip
//             icon={<ShoppingBag />}
//             sx={{ mt: 5, mr: 1 }}
//             label={`${quantity} productos`}
//           />

//           <Chip
//             icon={<Paid />}
//             sx={{ mt: 5, color: "white", fontWeight: "bold" }}
//             color="success"
//             label={`RD$${total}`}
//           />
//         </CardContent>
//         <CardActions>
//           <Link to={id} className="text-link">
//             <Button color="primary" sx={{ mr: 2 }}>
//               Ver productos
//             </Button>


//             {/* <IconButton aria-label="edit" color="info">
//               <Edit />
//             </IconButton>
//             <IconButton aria-label="delete" color="error">
//               <Delete />
//             </IconButton> */}


//           </Link>
//         </CardActions>
//       </Card>
//     </Grid>
//   )
// )}
