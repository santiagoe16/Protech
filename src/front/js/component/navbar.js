import { useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store, actions} = useContext(Context)
	const navigate = useNavigate();
	
	const logOut = () =>{
		localStorage.removeItem("jwt-token-seller")
		localStorage.removeItem("jwt-token-buyer")
		actions.changeAuthenticatedBuyer(false)
		actions.changeAuthenticatedSeller(false)
		navigate("/buyer/login")
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				
				<div className="ml-auto">
					{(store.authenticatedBuyer) ? (<Link to="/cartview"><button className="btn btn-primary">Cart</button></Link>):<></>}
					{(store.authenticatedBuyer) ? (<>
						<Link to="/productsbuyers"><button className="btn btn-primary">Products</button></Link>
						<Link to="/ordersplaced"><button className="btn btn-primary">orders placed</button></Link></>)
					:<></>}
					{(store.authenticatedBuyer || store.authenticatedSeller) ? (<button className="btn btn-danger" onClick={() => logOut()}>log out</button>):(<button className="btn btn-primary" onClick={() => navigate("/buyer/login")}>log in</button>)}
					
					{!store.authenticatedSeller && (
						<button className="btn btn-primary" onClick={() => navigate("/seller/login")}>Start selling</button>
					)}
					{store.authenticatedSeller == true ? (
						<button className="btn btn-primary" onClick={() => navigate("/selleraddress")}>update address</button>
					):(<></>)}
				</div>
			</div>
		</nav>
	);
};
