import {
  ArrowBack
} from "@mui/icons-material";
import {
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { ListPurchaseDetail } from "../components/ListPurchaseDetail";
import { AppLayout } from "../layout/AppLayout";

export const PurchaseDetailPage = () => {

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
          <Link to={"/purchases"} className="text-link">
            <Chip icon={<ArrowBack />} label="Regresar" onClick={() => {}} />
          </Link>

          <Typography variant="h6" noWrap component="div" margin={2.4}>
            Compra
          </Typography>
        </Grid>

        <ListPurchaseDetail/>
      </Grid>
    </AppLayout>
  );
};
