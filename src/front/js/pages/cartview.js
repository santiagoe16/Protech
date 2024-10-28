import React, {useState, useEffect, useContext} from "react";

export const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const GetCartItems = async () => {

    const token = localStorage.getItem("jwt-token"); 

    const response = await fetch(process.env.BACKEND_URL + "/api/buyer/cart/products", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCartItems(data);

    const total = data.reduce((acc,item) => (acc + (item.product.price * item.amount)),0)
    setTotalPrice(total)
  }

  useEffect(() => {
    GetCartItems();
  }, [])

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cartItems ? (cartItems.map((item) => (
            <tr key={item.item_id}>
              <td>{item.product.name}</td>
              <td>${item.product.price}</td>
              <td>{item.amount}</td>
            </tr>
          ))):(<tr><td>there is not items in the cart</td></tr>)
          }
        </tbody>
      </table>
      <h3>Total price: ${totalPrice.toFixed(2)}</h3>
    </div>
  )
}