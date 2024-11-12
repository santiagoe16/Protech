import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "/workspaces/lt34-protech/src/front/styles/dashboard.css";
import { Cart, CurrencyDollar, People } from 'react-bootstrap-icons';

export const DashboardProducts = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const getCartItems = () => {
		const token = actions.verifyTokenBuyer();

		fetch(process.env.BACKEND_URL + "/api/buyer/cart/products", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching cart items: " + response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				
			})
			.catch((error) => {
				console.error("Error fetching cart items:", error);
			});
	};

	useEffect(() => {
		getCartItems();
	}, []);

	return (
        <>
            <div className="row mb-4">
				<div className="col-12">
					<div className="card-black">
						<h1>Welcome to the dashboard</h1>
						<p>Here you can see all about yours products</p>
						<button className="purple">Create product</button>
					</div>
				</div>
			</div>
            <div className="mb-4">
				<div className="flex-nowrap row">
					<div className="col-4 ">
						<div className="body-card">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<div>
									<h5>Earnings</h5>
								</div>
								<div className="container-icon">
									<h5><CurrencyDollar className="card-icon"/></h5>
								</div>
							</div>
							<div>
								<h3 className="mb-2">$93,438.78</h3>
								<span className="text-gray">Monthly revenue</span>
							</div>
						</div>
					</div>
					<div className="col-4 ">
						<div className="body-card ">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<div>
									<h5>Orders</h5>
								</div>
								<div className="container-icon">
									<h5><Cart className="card-icon"/></h5>
								</div>
							</div>
							<div>
								<h3 className="mb-2">$93,438.78</h3>
								<span className="text-gray">Monthly revenue</span>
							</div>
						</div>
					</div>
					<div className="col-4">
						<div className="body-card">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<div>
									<h5>Customer</h5>
								</div>
								<div className="container-icon">
									<h5><People className="card-icon"/></h5>
								</div>
							</div>
							<div>
								<h3 className="mb-2">$93,438.78</h3>
								<span className="text-gray">Monthly revenue</span>
							</div>
						</div>
					</div>
					
				</div>
			</div>

        </>
	);
};