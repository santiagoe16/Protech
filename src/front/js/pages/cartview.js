import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const CartView = () => {
    const { store, actions } = useContext(Context);
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [totalPrice,setTotalPrice] = useState(0)
    const totalPriceRef = useRef(0);  // Usar ref para mantener el total
    const cartItemsRef = useRef([]);  // Usar ref para almacenar el estado actual de los items del carrito
    const cartIdRef = useRef(0);  // Usar ref para el cartId
    const navigate = useNavigate();

    // Función para obtener los elementos del carrito
    const getCartItems = () => {
        const token = actions.verifyTokenBuyer();
        fetch(process.env.BACKEND_URL + "/api/buyer/cart/products", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching cart items: " + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setCartItems(data); // Actualizamos el estado del carrito
                cartItemsRef.current = data;  // Guardamos en la ref
                const total = data.reduce((acc, item) => acc + item.product.price * item.amount, 0);
                setTotalPrice(total)
                totalPriceRef.current = total;  // Calculamos el total
                if (data.length > 0) {
                    setCartId(data[0].cart_id);
                    cartIdRef.current = parseInt(data[0].cart_id); 
                }
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            });
    };

    useEffect(() => {
        getCartItems(); // Se obtiene la información del carrito al montar el componente
    }, []);

    // Función para eliminar un item del carrito
    const deleteItem = (itemId) => {
        const token = actions.verifyTokenBuyer();

        fetch(process.env.BACKEND_URL + "/api/buyer/cart/products/" + itemId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error deleting item: " + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                // Al eliminar el artículo, obtenemos nuevamente los artículos y actualizamos el total
                getCartItems();
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
    };

    // Función para actualizar la cantidad de un item
    const updateItemQuantity = (itemId, newAmount) => {
        const token = actions.verifyTokenBuyer();
        if (newAmount === "") return;

        const updatedAmount = newAmount < 1 ? 1 : newAmount;

        fetch(process.env.BACKEND_URL + "/api/buyer/cart/products/" + itemId, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: updatedAmount,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error updating item quantity: " + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                // Después de actualizar la cantidad, obtener los artículos y actualizar el total
                getCartItems();
            })
            .catch((error) => {
                console.error("Error updating item quantity:", error);
            });
    };

    // Crear la orden de PayPal
    const createOrder = (data, actions) => {
        const total = totalPriceRef.current; // Tomamos el total actualizado

        if (total === 0 || cartItemsRef.current.length === 0) {
            console.error("No hay productos en el carrito o el total es 0");
            return;
        }

        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total.toFixed(2), // Aseguramos que el total esté con dos decimales
                    },
                },
            ],
        });
    };

    // Aprobar la compra
    const onApprove = () => {
        const token = actions.verifyTokenBuyer();
        fetch(process.env.BACKEND_URL + `/api/cart/${cartIdRef.current}/generate`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(() => navigate("/productsbuyers"))
    };

    return (
        <div className="container mt-5">
            <h2>Your Cart</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Delete</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <tr key={item.item_id}>
                                <td className="text-center" style={{ width: "20px" }}>
                                    <i
                                        className="fas fa-trash"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => deleteItem(item.item_id)}
                                    />
                                </td>
                                <td>{item.product.name}</td>
                                <td>${item.product.price.toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        defaultValue={item.amount}
                                        onChange={(e) => updateItemQuantity(item.item_id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                There are no items in the cart
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h3>Total price: ${totalPrice}</h3>

            <PayPalScriptProvider
                options={{
                    "client-id": "AZQaE8q4sHLoA6t11j6OvMYkpAhcykSsXil8Q0PtKiKGHJhxkAvUN154cqZGvUAH7RQcu8LeFuknfBOQ",
                    currency: "USD",
                    intent: "capture",
                }}
            >
                <div style={{width: "300px"}}>
                    <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                    />
                </div>
            </PayPalScriptProvider>
        </div>
    );
};
