import React from "react";

export const CardProduct = () => (
    <div className="card" style={{width: "12rem", maxHeight: ""}}>
        <img 
            src="https://placehold.co/700x530" 
            style={{width: "12rem", height: "170px", objectFit: "cover"}} 
            alt="..." 
        />
        <div>
            <p className="m-0">Card title</p>
            <p className="m-0">Some quick example text to build on </p>
        </div>
    </div>
)