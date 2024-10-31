import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Products } from "./pages/products";
import { Sellers } from "./pages/sellers";
import injectContext from "./store/appContext";
import { Compradores } from "./pages/Compradores";
import { LoginBuyer } from "./pages/loginbuyers";
import { SignupBuyer } from "./pages/signupbuyer";
import { Categorias } from "./pages/categoria";
import { Itemscarts } from "./pages/itemscarts";
import { Carts } from "./pages/carts";
import { Addresses } from "./pages/address";
import { SignupSeller } from "./pages/singupseller";
import { LoginSeller } from "./pages/loginseller";
import { CardProduct } from "./component/cardproduct";
import { ProductsBuyers } from "./pages/productsbuyers";
import { CartView } from "./pages/cartview";
import { Orders } from "./pages/ordersSeller";
import { OrdersPlaced } from "./pages/ordersplaced";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/>;

    return (
        <div className="h-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Products/>} path="/products" />
                        <Route element={<Categorias/>} path="/categorias" />
                        <Route element={<Sellers/>} path="/sellers" />
                        <Route element={<Compradores/>} path="/compradores" />
                        <Route element={<LoginBuyer/>} path="/buyer/login" />
                        <Route element={<SignupBuyer/>} path="/buyer/signup" />
                        <Route element={<Itemscarts/>} path="/itemscarts" />
                        <Route element={<Carts/>} path="/carts" />
                        <Route element={<Addresses/>} path="/addresses" />
                        <Route element={<SignupSeller/>} path="/seller/signup" />
                        <Route element={<LoginSeller/>} path="/seller/login" />
                        <Route element={<CardProduct/>} path="/cardproduct" />
                        <Route element={<ProductsBuyers/>} path="/productsbuyers" />
                        <Route element={<CartView/>} path="/cartview" />
                        <Route element={<Orders/>} path="/orders" />
                        <Route element={<OrdersPlaced/>} path="/ordersplaced" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
