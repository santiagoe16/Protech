import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const DetailProduct = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = actions.verifyTokenBuyer()
        if (!token) {
            navigate("buyer/login");
          } else {
            const selectedProduct = store.products.find((product) => product.id === parseInt(id));
            setProduct(selectedProduct);
          }
       
    }, [id, store.products]);

    return (
        <>
            {product ? (
                <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <img src={product.image} alt={product.name} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <div>
            <h2>Productos</h2>
            <ul>
                {store.products.map((product) => (
                    <li key={product.id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
            </div>
        </>
    );
};
