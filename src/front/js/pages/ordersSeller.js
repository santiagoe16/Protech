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

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Orders</h2>
            <ul>
                {orders.map((order, index) => (
                    <li key={index}>
                        <h4>Cart ID: {order.id}</h4>
                        <ul>
                            {order.items_cart.map((item, i) => (
                                <li key={i}>
                                    Product: {item.product.name}, Amount: {item.amount}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
