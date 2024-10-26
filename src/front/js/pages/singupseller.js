import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SignupSeller = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const raw = {
            email: email,
            name: name,
            password: password,
            phone: phone,
            bank_account: bankAccount
        };

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(raw)
        };

        fetch(process.env.BACKEND_URL + "/api/seller/reg", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => navigate("/seller/login"))
            .catch((error) => console.error('Fetch error:', error));
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-75">
            <div className="p-5 rounded-3 shadow">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-center mb-3">Sign up as Seller</h2>

                    <div className="mb-4">
                        <label htmlFor="name">name</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone">Phone number</label>
                        <input type="text" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bankAccount">Bank account</label>
                        <input type="text" className="form-control" id="bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} placeholder="Enter bank account" />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary w-100">Sign up</button>
                    </div>
                    <p>Already have an account? <Link to="/seller/login">Log in</Link></p>
                </form>
            </div>
        </div>
    );
};
