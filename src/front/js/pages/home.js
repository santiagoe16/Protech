import { useState, useEffect, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Categorias } from "./categoria";
import "/workspaces/lt34-protech/src/front/styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [amounts, setAmounts] = useState({});
    const [categorias, setCategorias] = useState([]);

    const logOut = () => {
        localStorage.removeItem("jwt-token-seller");
        localStorage.removeItem("jwt-token-buyer");
        actions.changeAuthenticatedBuyer(false);
        actions.changeAuthenticatedSeller(false);
        navigate("/buyer/login");
    };
    
    
    useEffect(() => {
        getProducts();
        getCategorias();
    }, []);

    const getProducts = () => {
        fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                const initialAmounts = {};
                data.forEach(product => {
                    initialAmounts[product.id] = 1;
                });
                setAmounts(initialAmounts);
            });
    };

    const getCategorias = () => {
        fetch(`${process.env.BACKEND_URL}/api/categorias`)
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error("Error fetching categorias:", error));
    };

    

    const filtering = (e) => {
        setFilter(e.target.value);
    };

    let results = [];
    if (!filter && minPrice === "" && maxPrice === "") {
        results = products;
    } else {
        results = products.filter((product) => {
            const matchesName = product.name && product.name.toLowerCase().includes(filter.toLowerCase());
            const matchesCategory = product.category && product.category.name.toLowerCase().includes(filter.toLowerCase());
            const price = product.price;
            const inPriceRange =
                (minPrice === "" || price >= parseFloat(minPrice)) &&
                (maxPrice === "" || price <= parseFloat(maxPrice));
            return (matchesName || matchesCategory) && inPriceRange;
        });
    }

    return (
    	<div className="wrapper">
  			<main className="main-content">
				<div className="carousel slide mb-4" id="carouselExampleCaptions" data-bs-ride="carousel">
					<div className="carousel-inner">
						<div className="carousel-item active">
							<img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 1" />
							<div className="carousel-caption d-none d-md-block">
								<h5>Slide 1 Title</h5>
								<p>Some description for slide 1.</p>
							</div>
						</div>
						<div className="carousel-item">
							<img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 2" />
							<div className="carousel-caption d-none d-md-block">
								<h5>Slide 2 Title</h5>
								<p>Some description for slide 2.</p>
							</div>
						</div>
						<div className="carousel-item">
							<img src="https://via.placeholder.com/1920x400" className="d-block w-100" alt="Slide 3" />
							<div className="carousel-caption d-none d-md-block">
								<h5>Slide 3 Title</h5>
								<p>Some description for slide 3.</p>
							</div>
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Previous</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>
  			</main>
		</div>

	);
};