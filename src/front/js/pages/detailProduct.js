import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles/detailProduct.css";


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
            <div className="container">
                <div className="container ProductDetail">
                    {product ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          
                            <div style={{ flex: 1, marginRight: '20px' }}>
                                <img src={product.image} alt={product.name}  />
                            </div>

                            <div style={{ flex: 2 }}>
                                <p>{product.category.name}</p>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <input
                                    type="number"
                                    size={10}
                                    value={store.amounts[product.id] || ""}
                                    onChange={(e) => actions.handleAmountChangeflux(product.id, e.target.value)}
                                    placeholder="Amount"
                                    className="form-control"
                                    id="amount"
                                />
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => actions.addToCartFlux(product.id)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="Detalles">
                
                               
                               
                </div>
                <div>
                    <h2>Productos</h2>
                    <ul>
                        {store.products.map((product) => (
                            <li key={product.id}>{product.name} - ${product.price}</li>
                        ))}
                    </ul>
                </div>
            </div>

        </>
    );
};
