import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
    const { store, actions } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const getOrders = (sellerId) => {
        const token = localStorage.getItem("jwt-token"); 

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`); 
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
    
        fetch( `${process.env.BACKEND_URL}/api/carts/seller/${sellerId}`, requestOptions)
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
        if (!token) {
            console.error("No valid token found. User might need to log in.");
            return;
        }
        console.log(`Attempting to update status for cart ${cartId} with new state ${newState}`);
        console.log(`Token used: ${token}`);

    
        fetch(`${process.env.BACKEND_URL}/api/carts/${cartId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ state: newState }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update order status");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const sellerId = store.sellerId || localStorage.getItem("sellerId");
            if (sellerId) {
                getOrders(sellerId);
            }
        })
        
        .catch(error => console.error("Error updating order status:", error));
    };
    

    useEffect(() => {
        if (store.sellerId) {
            getOrders(store.sellerId);
            console.log(store.sellerId)
        }
    }, [store.sellerId]);
    
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
                                            onClick={() => changeStatus(order.id, "completed")}
                                        >
                                            Mark as completed
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
