import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { ProductBrandPage } from "../pages/ProductBrandPage"
import { PurchaseDetailPage } from "../pages/PurchaseDetailPage"
import { PurchasePage } from "../pages/PurchasePage"
import { ShoppingPage } from "../pages/ShoppingPage"
import { SuperMaketPage } from "../pages/SuperMarketPage"
import { SuperMarketPageConfig } from "../pages/SupermarketPageConfig"


export const ShoppingRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/purchases" element={ <PurchasePage /> } />
        <Route path="/shopping/:supermarketid" element={ <ShoppingPage /> } />
        <Route path="/supermarkets" element={ <SuperMaketPage /> } />
        <Route path="/purchases/:id" element={ <PurchaseDetailPage /> } />

        <Route path="/setting/products-brands" element={ <ProductBrandPage /> } />
        <Route path="/setting/supermarkets" element={ <SuperMarketPageConfig /> } />

        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )
}
