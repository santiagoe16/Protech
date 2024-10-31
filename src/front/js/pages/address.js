import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Addresses = () => {
    const { store, actions } = useContext(Context);

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [activeTab, setActiveTab] = useState("home-tab");
    const [editAddressId, setEditAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null); 

    const getAddresses = () => {
        fetch(process.env.BACKEND_URL + "/api/addresses", { method: "GET" })
            .then((response) => response.json())
            .then((data) => setAddresses(data))
            .catch((error) => console.error("Error fetching addresses:", error));
    };

    useEffect(() => {
        getAddresses();
    }, []);

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        const newAddress = JSON.stringify({
            "address": address,
            "city": city,
            "postal_code": postalCode,
            "country": country
        });

        fetch(process.env.BACKEND_URL + "/api/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: newAddress,
        })
            .then((response) => {
                if (response.ok) {
                    getAddresses();
                    resetForm();
                } else {
                    console.error("Error adding address:", response.statusText);
                }
            })
            .catch((error) => console.error("Network error:", error));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getToEditAddress = async (address_id) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/address/${address_id}`, { method: "GET" });

            if (!response.ok) throw new Error("Error fetching address details");

            const data = await response.json();
            setActiveTab("edit-tab"); 
            setAddress(data.address);
            setCity(data.city);
            setPostalCode(data.postal_code);
            setCountry(data.country);
            setEditAddressId(address_id);
        } catch (error) {
            console.error("Error fetching address to edit:", error);
        }
    };

    const showAddressDetails = (address) => {
        setSelectedAddress(address);
        setActiveTab("details-tab");
    };

    const handleSubmitEditAddress = async (e) => {
        e.preventDefault();
        const updatedAddress = { address, city, postal_code: postalCode, country };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/address/${editAddressId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedAddress),
            });

            if (!response.ok) throw new Error("Error updating address");

            await getAddresses();
            resetForm();
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    const deleteAddress = (address_id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            fetch(`${process.env.BACKEND_URL}/api/address/${address_id}`, { method: "DELETE" })
                .then(response => {
                    if (response.ok) {
                        getAddresses(); 
                        alert("Address successfully deleted.");
                    } else {
                        throw new Error(`Error: ${response.statusText}`);
                    }
                })
                .catch(error => console.error("Network error:", error));
        }
    };

    const resetForm = () => {
        setActiveTab("home-tab");
        setAddress("");
        setCity("");
        setPostalCode("");
        setCountry("");
        setEditAddressId(null);
        setSelectedAddress(null); 
    };

    return (
        <div className="container mt-5">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "home-tab" ? "active" : ""}`}
                        id="home-tab"
                        onClick={() => handleTabChange("home-tab")}
                        type="button"
                        role="tab"
                        aria-controls="home-tab-pane"
                        aria-selected={activeTab === "home-tab"}
                    >
                        Show
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "profile-tab" ? "active" : ""}`}
                        id="profile-tab"
                        onClick={() => handleTabChange("profile-tab")}
                        type="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected={activeTab === "profile-tab"}
                    >
                        Create
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "edit-tab" ? "active" : ""}`}
                        id="edit-tab"
                        onClick={() => handleTabChange("edit-tab")}
                        type="button"
                        role="tab"
                        aria-controls="edit-tab-pane"
                        aria-selected={activeTab === "edit-tab"}
                    >
                        Edit
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "details-tab" ? "active" : ""}`}
                        id="details-tab"
                        onClick={() => handleTabChange("details-tab")}
                        type="button"
                        role="tab"
                        aria-controls="details-tab-pane"
                        aria-selected={activeTab === "details-tab"}
                    >
                        Details
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === "home-tab" ? "show active" : ""}`} id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                    <h3>Address List</h3>
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.id}>
                                {address.address}, {address.city} - {address.postal_code}, {address.country}
                                <button onClick={() => getToEditAddress(address.id)} className="btn btn-warning btn-sm mx-2">Edit</button>
                                <button onClick={() => deleteAddress(address.id)} className="btn btn-danger btn-sm">Delete</button>
                                <button onClick={() => showAddressDetails(address)} className="btn btn-info btn-sm mx-2">Show Details</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`tab-pane fade ${activeTab === "profile-tab" ? "show active" : ""}`} id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    <h3>Create Address</h3>
                    <form onSubmit={handleSubmitCreate}>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter the address" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter the city" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="postalCode" className="form-label">Postal Code</label>
                            <input type="text" className="form-control" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Enter the postal code" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input type="text" className="form-control" id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter the country" required />
                        </div>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </form>
                </div>
                <div className={`tab-pane fade ${activeTab === "edit-tab" ? "show active" : ""}`} id="edit-tab-pane" role="tabpanel" aria-labelledby="edit-tab" tabIndex="0">
                    <h3>Edit Address</h3>
                    <form onSubmit={handleSubmitEditAddress}>
                        <div className="mb-3">
                            <label htmlFor="editAddress" className="form-label">Address</label>
                            <input type="text" className="form-control" id="editAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter the address" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editCity" className="form-label">City</label>
                            <input type="text" className="form-control" id="editCity" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter the city" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editPostalCode" className="form-label">Postal Code</label>
                            <input type="text" className="form-control" id="editPostalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Enter the postal code" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editCountry" className="form-label">Country</label>
                            <input type="text" className="form-control" id="editCountry" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter the country" required />
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button type="button" onClick={resetForm} className="btn btn-secondary mx-2">Cancel</button>
                    </form>
                </div>
                <div className={`tab-pane fade ${activeTab === "details-tab" ? "show active" : ""}`} id="details-tab-pane" role="tabpanel" aria-labelledby="details-tab" tabIndex="0">
                    <h3>Address Details</h3>
                    {selectedAddress ? (
                        <div>
                            <p><strong>Address:</strong> {selectedAddress.address}</p>
                            <p><strong>City:</strong> {selectedAddress.city}</p>
                            <p><strong>Postal Code:</strong> {selectedAddress.postal_code}</p>
                            <p><strong>Country:</strong> {selectedAddress.country}</p>
                            <button onClick={() => setSelectedAddress(null)} className="btn btn-secondary">Back</button>
                        </div>
                    ) : (
                        <p>No address selected.</p>
                    )}
                </div>
            </div>
        </div>
    );
};