import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CartView = () => {
  const { store, actions } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartId, setCartId] = useState(null);
  const navigate = useNavigate()

  const getCartItems = () => {
    const token = actions.verifyTokenBuyer(); 

    fetch(process.env.BACKEND_URL + "/api/buyer/cart/products", {
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
        setCartItems(data);
        const total = data.reduce((acc, item) => acc + (item.product.price * item.amount), 0);
        setTotalPrice(total);

        if (data.length > 0) {
          setCartId(data[0].cart_id)
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }

  useEffect(() => {
    getCartItems();
  }, []);

  const deleteItem = (itemId) => {
    const token = actions.verifyTokenBuyer();

    fetch(process.env.BACKEND_URL + "/api/buyer/cart/products/" + itemId, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        getCartItems();
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  }

  const generateOrder = () =>{

    const token = actions.verifyTokenBuyer(); 
    
    fetch(process.env.BACKEND_URL + `/api/cart/${cartId}/generate`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((response) => {
      if (!response.ok) {
        // Lanza un error si la respuesta no es ok
        throw new Error("Error generating order: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Order generated successfully:", data);
      navigate("/productsbuyers")
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  } 

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
                <td className="text-center" style={{width: "20px"}}>
                  <i
                    className="fas fa-trash text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteItem(item.item_id)}
                  />
                </td>
                <td>{item.product.name}</td>
                <td>${item.product.price.toFixed(2)}</td>
                <td>{item.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">There are no items in the cart</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Total price: ${totalPrice.toFixed(2)}</h3>
      <button className="btn btn-primary" onClick={() => generateOrder()}>generate order</button>
    </div>
  );
}