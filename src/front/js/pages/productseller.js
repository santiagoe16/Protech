import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const ProductsSeller = () => {
    const { store, actions } = useContext(Context);
    const [products, setProducts] = useState([]);
    const [productImages, setProductImages] = useState({}); 
    const cloudName = "dqs1ls601"; 
    const presetName = "Protech"; 
    const navigate = useNavigate(); 
    
    
    const getProducts = () => {
        const token = actions.verifyTokenSeller(); 
        
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

    const updateProductImageInDB = async (productId, imageUrl) => {
        const token = actions.verifyTokenSeller(); 
        if (!token) {
            console.error("No valid token found. User might need to log in.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/products/${productId}/update-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ image_url: imageUrl })
            });
    
            if (!response.ok) {
                throw new Error("Failed to update product image in the database");
            }
    
            const data = await response.json();
            console.log("Product image updated in database:", data);
        } catch (error) {
            console.error("Error updating product image in DB:", error);
        }
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
            const imageUrl = data.secure_url;
            setProductImages(prevState => ({
                ...prevState,
                [productId]: imageUrl
            }));
    
        
            await updateProductImageInDB(productId, imageUrl);
    
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        const token = actions.verifyTokenSeller();
        if (!token) {
            navigate("/login");
        } else {
            getProducts();
        }
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
