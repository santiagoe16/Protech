import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const ProductsBuyers = () => {
    const { store, actions } = useContext(Context);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState("");
    const [activeTab, setActiveTab] = useState("list-tab");
    const [amounts, setAmounts] = useState({});

    const getProducts = () => {
        fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                const initialAmounts = {};
                console.log(data)
                data.forEach(product => {
                    initialAmounts[product.id] = 1;
                });
                setAmounts(initialAmounts);
            });
    }

    useEffect(() => {
        getProducts();
    }, []);

    const viewMore = (product_id) => {
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setActiveTab("view-more-tab");
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setStock(data.stock);
                setImage(data.image);
            });
    }

    const addToCart = (productId) => {
        const raw = JSON.stringify({
            "amount": parseInt(amounts[productId]) || 1,
            "product_id": parseInt(productId)
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt-token")}`,
            },
            body: raw,
            redirect: "follow"
        };

        fetch(process.env.BACKEND_URL + "/api/itemscarts", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result.message);
                getProducts();
                setActiveTab("list-tab");
            })
            .catch((error) => console.error(error));
    }

    const handleAmountChange = (productId, value) => {
        if (value === "") {
            setAmounts({
                ...amounts,
                [productId]: "" 
            });
        } else {
            const amountValue = Math.max(1, parseInt(value)); 
            setAmounts({
                ...amounts,
                [productId]: amountValue
            });
        }
    }

    return (
        <>
            <div className="container mt-5">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "list-tab" ? "active" : ""}`}
                            id="list-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#list-tab-pane"
                            type="button" role="tab"
                            aria-controls="list-tab-pane"
                            aria-selected={activeTab === "list-tab"}
                            onClick={() => setActiveTab("list-tab")}
                        >List</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "view-more-tab" ? "active" : "d-none"}`}
                            id="edit-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#view-more-tab-pane"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "view-more-tab"}
                        >View More</button>
                    </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${activeTab === "list-tab" ? "show active" : ""}`} id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab" tabIndex="0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <td>View more</td>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td className="text-center">
                                                <i style={{ cursor: "pointer" }}
                                                    className="fas fa-eye"
                                                    onClick={() => viewMore(product.id)}
                                                ></i>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price}$</td>
                                            <td>{product.stock}</td>
                                            <td>{product.image}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    size={10}
                                                    value={amounts[product.id] || ""}
                                                    onChange={(e) => handleAmountChange(product.id, e.target.value)}
                                                    placeholder="Amount"
                                                    className="form-control"
                                                    id="amount"
                                                />
                                                <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => addToCart(product.id)}
                                                >Add to Cart</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8">There are no items in the table.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "view-more-tab" ? "show active" : ""}`} id="view-more-tab-pane" role="tabpanel" aria-labelledby="view-more-tab" tabIndex="0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{price}$</td>
                                    <td>{stock}</td>
                                    <td>{image}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}