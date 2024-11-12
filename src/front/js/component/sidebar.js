import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Bag, House, Cart, ListTask, CaretDown, CaretUp, CircleFill } from 'react-bootstrap-icons';
import "/workspaces/lt34-protech/src/front/styles/sidebar.css"

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartId, setCartId] = useState(null);
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <>
            <div className="sidebar">
                <div className="navbar-dashboard">
                    <div className="container d-flex">
                        <div>
                            <h4 className="mb-0">Navbar</h4>
                        </div> 
                        <div className="ms-auto">
                            <button className="btn btn-primary" onClick={() => navigate("buyer/login")}>Login</button>
                        </div>
                    </div>
                </div>
                <h3>Protech</h3>
                <ul>
                    <li>
                        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active" : "")}>
                            <House className="icon-li" /> Dashboard
                        </NavLink>
                    </li>
                    <p>Store Managements</p>
                    <li>
                        <NavLink to="/dashboard/products" className={({ isActive }) => (isActive ? "active" : "")}>
                            <Cart className="icon-li" /> Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/buyeraddress/categories" className={({ isActive }) => (isActive ? "active" : "")}>
                            <ListTask className="icon-li" /> Categories
                        </NavLink>
                    </li>
                    <li className="dropdownn-trigger">
                        <NavLink to="" onClick={toggleDropdown} className={({ isActive }) => (isActive ? "active" : "")}>
                            <Bag className="icon-li" /> Orders
                            {isDropdownOpen ? (
                                <CaretUp className="drop-icon" />
                            ) : (
                                <CaretDown className="drop-icon" />
                            )}
                        </NavLink>
                        {isDropdownOpen && (
                            <ul className="dropdownn-menu">
                                <li>
                                    <NavLink to="/orders/seller" className={({ isActive }) => (isActive ? "active" : "")}>
                                        <CircleFill className="icon-circle" /> Pending Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="" className={({ isActive }) => (isActive ? "active" : "")}>
                                        <CircleFill className="icon-circle" /> Completed Orders
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
};