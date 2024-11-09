import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "/workspaces/lt34-protech/src/front/styles/sidebar.css"

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartId, setCartId] = useState(null);
    const navigate = useNavigate();



    return (
        <>
            <div className="sidebar">
                <div className="navbar">
                    <h3>Navbar dentro del Sidebar</h3>
                </div>
                <h2>Mi Sidebar</h2>
                <ul>
                    <li><a href="#home">Inicio</a></li>
                    <li><a href="#about">Acerca de</a></li>
                    <li><a href="#services">Servicios</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
            </div>
        </>

    );
};