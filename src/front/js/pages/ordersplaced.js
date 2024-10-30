import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const OrdersPlaced = () => {
    const { store, actions } = useContext(Context);
    const [cartItems, setCartItems] = useState([]);
    const [carts, setCarts] = useState([])

    const getCartItems = () => {
        const token = actions.verifyTokenBuyer(); 

        fetch(process.env.BACKEND_URL + "/api/carts/itemscart", {
            method: "GET",
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
            setCarts(data);
        })
        .catch((error) => {
            console.error("Error fetching cart items:", error);
        });
    }

    useEffect(() => {
        getCartItems();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Your Orders</h2>
            {carts.length > 0 ? (
                carts.map((cart) => (
                    <div key={cart.cart_id} className="mb-5">
                        <h4>Cart Date: {new Date(cart.created_at).toLocaleDateString()}</h4>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.items.length > 0 ? (
                                    cart.items.map((item) => (
                                        <tr key={item.item_id}>
                                            <td>{item.product.name}</td>
                                            <td>${item.product.price.toFixed(2)}</td>
                                            <td>{item.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No items in this cart.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <h5>Total Price: ${cart.total_price.toFixed(2)}</h5>
                        <h5 className="mb-5">State: {cart.state}</h5>
                    </div>
                ))
            ) : (
                <h2>No carts found.</h2>
            )}
        </div>
    );
}