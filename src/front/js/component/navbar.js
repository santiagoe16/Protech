import { useContext, useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "/workspaces/lt34-protech/src/front/styles/navbar.css";
import { Trash } from 'react-bootstrap-icons';

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [cart, setCart] = useState({});
	const [cartEmpty, setCartEmpty] = useState(true);
	
	const logOut = () => {
		localStorage.removeItem("jwt-token-seller");
		localStorage.removeItem("jwt-token-buyer");
		actions.changeAuthenticatedBuyer(false);
		actions.changeAuthenticatedSeller(false);
		navigate("/buyer/login");
	};


	useEffect(() => {
        if (store.cart) {
            setCart(store.cart);
			if(store.cart?.items?.length > 0 ){
				setCartEmpty(false)
			}
			else setCartEmpty(true)
        }
    }, [store.cart]);

	const removeItem = (itemId) => {
        const token = actions.verifyTokenBuyer();

        fetch(process.env.BACKEND_URL + "/api/buyer/cart/products/" + itemId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error deleting item: " + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                actions.getCart();
            })
            .catch((error) => {
                console.error("Error removing item from cart:", error);
            });
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
							<Link to="/cart">
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
							<button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">cartsito</button>

							<div className="offcanvas offcanvas-end text-white" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" 
								id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
								<div className="offcanvas-header border-bottom border-secondary">
									<h4 className="offcanvas-title" id="offcanvasScrollingLabel">Shop Cart</h4>
									<button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
								</div>
								<div className="offcanvas-body">
									<ul className="list-group list-group-flush ">
										{cart.items?.length > 0 ? (cart.items.map((item, index) =>(
											<li key={index} className="px-0 border-bottom border-secondary list-group-item item-cart justify-content center">
												<div className="align-items-center row text-white">
													<div className="col-6">
														<div className="ms-3">
															<p>{item.product.name}</p>
															<a className="text-secondary" onClick={()=>removeItem(item.item_id)} ><Trash/> Remove</a>
														</div>
													</div>
													<div className="col-3">
														<div className="input-group">
															<button style={{borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px"}}
																className="button-input"
																onClick={() =>
																	actions.updateCartItemAmount(item.item_id, item.amount - 1)
																}
															>
																-
															</button>
															<input
																type="number"
																value={item.amount || 1}
																className="input-amount text-center"
																onChange={(e) =>
																	actions.updateCartItemAmount(item.item_id, parseInt(e.target.value) || 1)
																}
																min="1"
															/>
															<button style={{borderEndEndRadius: "5px", borderTopRightRadius: "5px"}}
																className="button-input"
																onClick={() =>
																	actions.updateCartItemAmount(item.item_id, item.amount + 1)
																}
															>
																+
															</button>
														</div>
													</div>
													<div className="col-3">
														<div>
															<p className="text-center">${(item.product.price * item.amount).toFixed(2)}</p>
														</div>
													</div>
												</div>
											</li>
										))):(<>
											<div className="row d-flex justify-content-center mt-5">
												<div className="col-12">
													<h3 className="text-center">the cart is empty</h3>
												</div>
											</div>
										</>)}
									</ul>
									{cartEmpty ? (<></>):(
										<div className="ms-auto d-flex mt-4">
											<button onClick={() => navigate("/cart")} data-bs-dismiss="offcanvas" aria-label="Close" 
												className="purple-button ms-auto">
												Proceed To Checkout
											</button>
										</div>
									)}
								</div>
							</div>
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
							<button className="btn btn-primary" onClick={() => navigate("/profile/seller")}>Profile</button>
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
