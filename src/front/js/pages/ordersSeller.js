import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
    const { store, actions } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const getOrders = () => {
        const token = localStorage.getItem("jwt-token"); 

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`); 
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
    
        fetch("https://unhallowed-troll-pjqpxrg7xwjfrp6j-3001.app.github.dev/api/carts/seller/2", requestOptions)
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

    const changeStatus = (cartId, newState) => {
        const token = localStorage.getItem("jwt-token"); 

        fetch(`${process.env.BACKEND_URL}/api/carts/${cartId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ state: newState }) 
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            getOrders(); 
        })
        .catch(error => console.error("Error updating order status:", error));
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
                        <th>Acciones</th>
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
                                <td>
                                    {order.state === "generated" && (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => changeStatus(order.id, "sent")}
                                        >
                                            Mark as sent
                                        </button>
                                    )}
                                    {order.state === "sent" && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => changeStatus(order.id, "delivered")}
                                        >
                                            Mark as delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
