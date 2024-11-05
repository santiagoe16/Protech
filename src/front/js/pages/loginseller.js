import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const LoginSeller = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msgError, setMsgError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => { 
        e.preventDefault();
        
        setMsgError(null);

        const raw = {
            email: email,
            password: password 
        };
        
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(raw)
        };
   
        fetch(process.env.BACKEND_URL + "/api/seller/login", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    setMsgError("Bad email or password");
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then((result) =>  {
                console.log(result.access_token);
                localStorage.setItem("jwt-token", result.access_token);
                actions.changeAuthenticatedSeller(true);  
                navigate("/sellers/products");
                localStorage.setItem("jwt-token-seller", result.access_token);
                actions.changeAuthenticatedSeller(true); 
                actions.setSellerId(result.seller_id);  
                navigate("/products");
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-75">
            <div className="p-5 rounded-3 shadow">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-center mb-3">Log in as a Seller</h2>
                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                        <p className="text-danger">{msgError ? msgError : null}</p>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </div>
                    <p>Don't have an account? <Link to="/seller/signup">Sign up</Link></p>
                </form>
            </div>
        </div>
    );
};
