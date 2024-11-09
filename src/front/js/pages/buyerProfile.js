import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext";

export const BuyerProfile = () => {
    const { store, actions } = useContext(Context);
    const [selectedFile, setSelectedFile] = useState(null);
    const [buyerProfile, setBuyerProfile] = useState(null);
    const navigate = useNavigate();

    const cloudName = "dqs1ls601";
    const presetName = "Protech";

    const getBuyerProfile = () => {
        const token = actions.verifyTokenBuyer();

        if (!token) {
            console.error("No valid token found. User might need to log in.");
            navigate("/login");
            return;
        }

        fetch(`${process.env.BACKEND_URL}/api/buyer/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch buyer profile");
                return response.json();
            })
            .then((data) => setBuyerProfile(data))
            .catch((error) => console.error("Error:", error));
    };

    const handleImageUpload = () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", presetName);

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const imageUrl = data.secure_url;
                
                
                setBuyerProfile(prevProfile => ({ ...prevProfile, image: imageUrl }));

                
                updateProfileImage(imageUrl);
            })
            .catch((error) => console.error("Image upload failed:", error));

            
    };

    
    const updateProfileImage = (imageUrl) => {
        const token = actions.verifyTokenBuyer();
        
        fetch(`${process.env.BACKEND_URL}/api/buyer/profile/image`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageUrl }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update profile image");
                console.log("Profile image updated");
                getBuyerProfile();  // Actualiza el perfil después de subir la imagen
            })
            .catch((error) => console.error("Error updating profile image:", error));
    };

    useEffect(() => {
        getBuyerProfile();
    }, []); 

    return (
        <div className="container">
            <div>
                <h3>Buyer Profile</h3>
                {buyerProfile ? (
                    <div>
                        <p><strong>Name:</strong> {buyerProfile.name}</p>
                        <p><strong>Email:</strong> {buyerProfile.email}</p>

                        <img
                            src={buyerProfile.image}
                            alt={buyerProfile.name}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <br />
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            accept="image/*"
                        />
                        <button onClick={handleImageUpload}>Upload Image</button>
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}
            </div>
        </div>
    );
};
