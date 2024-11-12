

import { useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	
	const logOut = () => {
		localStorage.removeItem("jwt-token-seller");
		localStorage.removeItem("jwt-token-buyer");
		actions.changeAuthenticatedBuyer(false);
		actions.changeAuthenticatedSeller(false);
		navigate("/buyer/login");
	};

	return (
		<nav className="navbar navbar-light bg-light" style={{height: "50px", marginLeft: "0"}}>
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				
				<div className="ml-auto">
					{store.authenticatedBuyer && (
						<>
							<Link to="/buyer/profile">
								<button className="btn btn-primary">Profile</button>
							</Link>
							<Link to="/cartview">
								<button className="btn btn-primary">Cart</button>
							</Link>
							<Link to="/productsbuyers">
								<button className="btn btn-primary">Products</button>
							</Link>
							<Link to="/ordersplaced">
								<button className="btn btn-primary">Orders Placed</button>
							</Link>
							<Link to="/buyeraddress">
								<button className="btn btn-primary">Add Address</button>
							</Link>
						</>
					)}

					{store.authenticatedSeller && (
						<>
							<Link to="/orders">
								<button className="btn btn-primary">Orders</button>
							</Link>
							<button className="btn btn-primary" onClick={() => navigate("/selleraddress")}>Update Address</button>
							<button className="btn btn-primary" onClick={() => navigate("/product/seller")}>My Products</button>
							<button className="btn btn-primary" onClick={() => navigate("/dashboard")}>dashboard</button>
						</>
					)}

					{(store.authenticatedBuyer || store.authenticatedSeller) ? (
						<button className="btn btn-danger" onClick={logOut}>Log Out</button>
					) : (
						<>
							<button className="btn btn-primary" onClick={() => navigate("/buyer/login")}>Log In</button>
							{!store.authenticatedSeller && (
								<button className="btn btn-primary" onClick={() => navigate("/seller/login")}>Start Selling</button>
							)}
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
