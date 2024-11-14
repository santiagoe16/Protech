import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "/workspaces/lt34-protech/src/front/styles/dashboard.css";
import { Cart, CurrencyDollar, People, CaretDown } from 'react-bootstrap-icons';

export const Dashboard = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const getCartItems = () => {
		const token = actions.verifyTokenBuyer();

		
	};

	useEffect(() => {
		getCartItems();
	}, []);

	return (
		<div style={{paddingBottom: "100px"}}>
            <div className="row mb-4">
				<div className="col-12">
					<div className="card-black">
						<div style={{padding: "55px 77px"}}>
							<h1>Welcome to the dashboard</h1>
							<p>Here you can see all about yours products</p>
							<button className="purple-button">Create product</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex-nowrap row mb-4">
				<div className="col-4 ">
					<div className="body-card card-black">
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
					<div className="body-card card-black">
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
					<div className="body-card card-black">
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
			<div className="flex-nowrap row mb-4">
				<div className="col-8">
					<div className="card-black body-card">
						<div className="d-flex justify-content-between">
							<div>
								<h5>Revenue</h5>
								<span>(+63%) than last year)</span>
							</div>
							<div>
								<select className="form-select" id="opciones" name="opciones">
									<option value="opcion1">2024</option>
									<option value="opcion2">2023</option>
									<option value="opcion3">2022</option>
								</select>
							</div>
						</div>
						<div className="grafic">

						</div>
					</div>
				</div>
				<div className="col-4">
					<div className="card-black body-card h-100">
						<div><h5>Total Sales</h5></div>
					</div>
				</div>
			</div>
			<div className="flex-nowrap row mb-4">
				<div className="col-6">
					<div className="card-black body-card" style={{height: "225px"}}>
						<div><h5>Sales Overview</h5></div>
					</div>
				</div>
				<div className="col-6">
					<div >
						<div className="card-black body-card mb-3">
							<h5>Start your day with New Notification.</h5>
							<span>You have 2 new notification</span>
						</div>
						<div className="card-black body-card">
							<h5>Monitor your Sales and Profitability</h5>
							<span>You have View Performance</span>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="card-black">
						<div className="pt-4 ps-4 pb-3"> <h5>Recent orders</h5> </div>
						<div className="pb-2 table-responsive">
							<table className="table-centered text-nowrap  table table-borderless table-hover">
								<thead>
									<tr className="bg-purple">
										<th>Order Number</th>
										<th>Product Name</th>
										<th>Order Date</th>
										<th>Price</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>#FC0005</td>
										<td>Haldiram's Sev Bhujia</td>
										<td>28 March 2023</td>
										<td>$18.00</td>
										<td>Shipped</td>
									</tr>
									<tr>
										<td>#FC0004</td>
										<td>NutriChoice Digestive</td>
										<td>24 March 2023</td>
										<td>$24.00</td>
										<td>Pending</td>
									</tr>
									<tr>
										<td>#FC0003</td>
										<td>Onion Flavour Potato</td>
										<td>8 Feb 2023</td>
										<td>$9.00</td>
										<td>Cancel</td>
									</tr>
									<tr>
										<td>#FC0002</td>
										<td>Blueberry Greek Yogurt</td>
										<td>20 Jan 2023</td>
										<td>$12.00</td>
										<td>Pending</td>
									</tr>
									<tr>
										<td>#FC0001</td>
										<td>Slurrp Millet Chocolate</td>
										<td>14 Jan 2023</td>
										<td>$8.00</td>
										<td>Processing</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};