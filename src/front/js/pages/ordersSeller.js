import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
    const { store, actions } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const getOrders = () => {
        const token = localStorage.getItem('jwt-token'); 

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`); 
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
    
        fetch(process.env.BACKEND_URL + "/api/carts/seller/2", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                return response.json(); 
            })
            .then((data) => {
                setOrders(data);
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="container mt-5">
        <h2>Orders</h2>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>ID Carrito</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Estatus</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) =>
                    order.items_cart.map((item, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{item.product.name}</td>
                            <td>{item.amount}</td>
                            <td>{order.state}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
    );
};
