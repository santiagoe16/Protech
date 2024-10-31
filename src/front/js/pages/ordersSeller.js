import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
    const { store, actions } = useContext(Context);
    const [sellerOrders, setSellerOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getOrders = () => {
        const token = actions.verifyTokenSeller(); 
        const sellerId = actions.getSellerId(); 

        fetch(process.env.BACKEND_URL + "/api/carts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error fetching cart items: " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
          
            const filteredOrders = data
                .filter(cart => cart.items_cart.some(item => item.product.seller_id === sellerId))
                .map(cart => ({
                    ...cart,
                    items_cart: cart.items_cart.filter(item => item.product.seller_id === sellerId)
                }));
            
            setSellerOrders(filteredOrders);
        })
        .catch((error) => {
            console.error("Error fetching cart items:", error);
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mt-5">
            <h2>Orders</h2>
            {/* Renderizar las órdenes del vendedor */}
            <ul>
                {sellerOrders.map(order => (
                    <li key={order.id}>
                        <h4>Order ID: {order.id}</h4>
                        <p>Total Price: {order.total_price}</p>
                        <ul>
                            {order.items_cart.map(item => (
                                <li key={item.id}>
                                    {item.product.name} - Amount: {item.amount}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
