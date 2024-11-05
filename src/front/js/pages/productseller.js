import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const ProductsSeller = () => {
    const { store } = useContext(Context);
    const [products, setProducts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const getProducts = () => {
        const token = localStorage.getItem("jwt-token");

        if (!token) {
            console.error("No valid token found. User might need to log in.");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${process.env.BACKEND_URL}/api/products/seller`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                console.log(data);
            })
            .catch(error => console.error("Error:", error));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const updateProductImage = (productId) => {
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        const token = localStorage.getItem("jwt-token");
        const formData = new FormData();
        formData.append("image", selectedFile);

        fetch(`${process.env.BACKEND_URL}/api/products/${productId}/image`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update product image");
            }
            return response.json();
        })
        .then(data => {
            console.log("Image updated:", data);
            getProducts(); 
        })
        .catch(error => console.error("Error updating product image:", error));
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="container mt-5">
            <h2>My Products</h2>
            {products.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <img src={product.image} alt={product.name} style={{ width: "100px" }} />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        className="btn btn-primary mt-2"
                                        onClick={() => updateProductImage(product.id)}
                                    >
                                        Change Image
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No products found for this seller.</p>
            )}
        </div>
    );
};
