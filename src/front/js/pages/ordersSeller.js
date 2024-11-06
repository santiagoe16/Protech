import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
    const { store, actions } = useContext(Context);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getOrders = () => {
        const token = actions.verifyTokenSeller(); 
        if (!token) {
            navigate('/login');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`); 

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.BACKEND_URL}/api/carts/seller`, requestOptions)
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
            .catch((error) => {
                console.error("Error:", error);
                alert("There was an error fetching orders. Please try again later.");
            })
            .finally(() => {
                setLoading(false); 
            });
    };

    const changeStatus = (cartId, newState) => {
        const token = actions.verifyTokenSeller();
        if (!token) {
            console.error("No valid token found. User might need to log in.");
            return;
        }

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
            getOrders();
        })
        .catch(error => console.error("Error updating order status:", error));
    };

 
    useEffect(() => {
        const token = actions.verifyTokenSeller();
        if (!token) {
            navigate("/login");
        } else {
            getOrders();
        }
    }, []);
    return (
        <div className="container mt-5">
            <h2>Orders</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
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
                            order.items_cart.map((item) => (
                                <tr key={`${order.id}-${item.product.id}`}>
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
            )}
        </div>
    );
};
