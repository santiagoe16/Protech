import React from "react";

export const CardProduct = () => (
    <div className="card" style={{width: "14rem", maxHeight: ""}}>
        <img 
            src="https://placehold.co/200x330" 
            style={{width: "14rem", height: "190px", objectFit: "cover"}} 
            alt="..." 
        />
        <div className="card-body">
            <h6 className="card-title">Card title</h6>
            <p className="card-text">Some quick example text to build on </p>
        </div>
    </div>
)