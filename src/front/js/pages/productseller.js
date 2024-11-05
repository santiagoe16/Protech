import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const ProductsSeller = () => {
    const { store } = useContext(Context);
    const [products, setProducts] = useState([]);
    const [productImages, setProductImages] = useState({}); 
    const cloudName = "dqs1ls601"; 
    const presetName = "Protech"; 

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
            })
            .catch(error => console.error("Error:", error));
    };

    const handleFileChange = async (e, productId) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', presetName);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setProductImages(prevState => ({
                ...prevState,
                [productId]: data.secure_url 
            }));
            console.log("Image uploaded:", data.secure_url);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
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
                                    <img 
                                        src={productImages[product.id] || product.image} 
                                        alt={product.name} 
                                        style={{ width: "100px" }} 
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, product.id)}
                                    />
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
