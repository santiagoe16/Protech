import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Blog = () => {
	const { store, actions } = useContext(Context);
	const [articles, setArticles] = useState([]); // Cambio a plural para reflejar que es una lista
	const navigate = useNavigate();

	// Función para obtener los artículos
	const getArticles = () => {
		fetch(process.env.BACKEND_URL + "/api/articles")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching articles: " + response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				setArticles(data); // Actualiza el estado con los datos recibidos
			})
			.catch((error) => {
				console.error("Error fetching articles:", error);
			});
	};

	// Cargar los artículos al montar el componente
	useEffect(() => {
		getArticles();
	}, []);

	// Si no hay artículos, muestra un mensaje
	if (articles.length === 0) {
		return (
			<div className="container mt-5">
				<h2>No hay artículos disponibles</h2>
			</div>
		);
	}

	return (
        <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-center mb-5">Lista de Artículos</h1>
            <div style={{ width: "70%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {articles.map((article) => (
                    <div key={article.id} className="p-5 rounded-3 shadow mb-5 w-100">
                        <div>
                            <h2 className="text-center">{article.title}</h2>
                        </div>
                        <div style={{ width: "100%", height: "500px", display: "flex", justifyContent: "center" }}>
                            <img
                                src={article.image ? article.image : "https://via.placeholder.com/300"}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                alt={article.title}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p>{article.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};