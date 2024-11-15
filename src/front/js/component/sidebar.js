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

    const logOut = () => {
		localStorage.removeItem("jwt-token-seller");
		localStorage.removeItem("jwt-token-buyer");
		actions.changeAuthenticatedBuyer(false);
		actions.changeAuthenticatedSeller(false);
		navigate("/buyer/login");
	};

    return (
        <>
            <div className="sidebar">
                <div className="navbar-dashboard">
                    <div className="container d-flex">
                        <div>
                        </div> 
                        <div className="ms-auto nav-item">
                            <div className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="/workspaces/lt34-protech/public/github_logo_white_background.jpg" alt="" className="bg-light avatar avatar-md rounded-circle"/>

                            </div>
                            <ul className="dropdown-menu dropdown-menu-end p-2">
                                <li><NavLink to="/productsbuyers" className="item-dropdown" >Home</NavLink></li>
                                <li><NavLink to="/profile/seller" className="item-dropdown" >Profile</NavLink></li>
                                <hr className="dropdown-divider"/>
                                <li><a onClick={()=>logOut} className="item-dropdown log-out" >Log Out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <h3>Protech</h3>
                <ul>
                    <li>
                        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <House className="icon-li" /> Dashboard
                        </NavLink>
                    </li>
                    <p>Store Managements</p>
                    <li>
                        <NavLink to="/dashboard/products" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <Cart className="icon-li" /> Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/buyeraddress/categories" className={ ({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                            <ListTask className="icon-li" /> Categories
                        </NavLink>
                    </li>
                    <li className="dropdownn-trigger">
                        <NavLink to="" onClick={()=>setIsDropdownOpen(!isDropdownOpen)} className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
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
                                    <NavLink to="/orders/seller" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
                                        <CircleFill className="icon-circle" /> Pending Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="" className={({ isActive }) => (isActive ? "active sidebar-item" : "sidebar-item")}>
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