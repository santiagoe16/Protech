import { useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store, actions} = useContext(Context)
	const navigate = useNavigate();
	
	const logOut = () =>{
		localStorage.removeItem("jwt-token")
		actions.changeAuthenticatedBuyer(false)

		navigate("/buyer/login")
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">action</button>
					</Link>
				</div>
				<div className="ml-auto">
					{store.authenticatedBuyer ? (<button className="btn btn-danger" onClick={() => logOut()}>log out</button>):(<button className="btn btn-primary" onClick={() => navigate("/buyer/login")}>log in</button>)}
					
				</div>
			</div>
		</nav>
	);
};
