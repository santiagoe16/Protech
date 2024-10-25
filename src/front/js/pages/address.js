import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Direcciones = () => {
    const { store, actions } = useContext(Context);

    const [direcciones, setDirecciones] = useState([]);
    const [address, setAddress] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [pais, setPais] = useState("");
    const [activeTab, setActiveTab] = useState("home-tab");
    const [editDireccionId, setEditDireccionId] = useState(null); // Estado para el ID de la dirección a editar
    const [selectedDireccion, setSelectedDireccion] = useState(null); // Estado para la dirección seleccionada

    const getDirecciones = () => {
        fetch(process.env.BACKEND_URL + "/api/direcciones/", { method: "GET" })
            .then((response) => response.json())
            .then((data) => setDirecciones(data))
            .catch((error) => console.error("Error fetching direcciones:", error));
    };

    useEffect(() => {
        getDirecciones();
    }, []);

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        const newDireccion = JSON.stringify({ address, ciudad, codigoPostal, pais });

        fetch(process.env.BACKEND_URL + "/api/direcciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: newDireccion,
        })
            .then((response) => {
                if (response.ok) {
                    getDirecciones();
                    resetForm();
                } else {
                    console.error("Error adding direccion:", response.statusText);
                }
            })
            .catch((error) => console.error("Network error:", error));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getToEditDireccion = async (direccion_id) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/direcciones/${direccion_id}`, { method: "GET" });

            if (!response.ok) throw new Error("Error fetching direccion details");

            const data = await response.json();
            setActiveTab("edit-tab"); // Cambia a la pestaña de edición
            setAddress(data.address);
            setCiudad(data.ciudad);
            setCodigoPostal(data.codigoPostal);
            setPais(data.pais);
            setEditDireccionId(direccion_id); // Establece el ID de la dirección a editar
        } catch (error) {
            console.error("Error fetching direccion to edit:", error);
        }
    };

    const showDireccionDetails = (direccion) => {
        setSelectedDireccion(direccion);
        setActiveTab("details-tab"); // Cambia a la pestaña de detalles
    };

    const handleSubmitEditDireccion = async (e) => {
        e.preventDefault();
        const updatedDireccion = { address, ciudad, codigoPostal, pais };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/direcciones/${editDireccionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedDireccion),
            });

            if (!response.ok) throw new Error("Error updating direccion");

            await getDirecciones();
            resetForm();
        } catch (error) {
            console.error("Error updating direccion:", error);
        }
    };

    const deleteDireccion = (direccion_id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
            fetch(`${process.env.BACKEND_URL}/api/direcciones/${direccion_id}`, { method: "DELETE" })
                .then(response => {
                    if (response.ok) {
                        getDirecciones(); // Recarga la lista de direcciones
                        alert("Dirección eliminada exitosamente.");
                    } else {
                        throw new Error(`Error: ${response.statusText}`);
                    }
                })
                .catch(error => console.error("Network error:", error));
        }
    };

    const resetForm = () => {
        setActiveTab("home-tab");
        setAddress("");
        setCiudad("");
        setCodigoPostal("");
        setPais("");
        setEditDireccionId(null); // Resetear el ID de la dirección a editar
        setSelectedDireccion(null); // Resetear la dirección seleccionada
    };

    return (
        <div className="container mt-5">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "home-tab" ? "active" : ""}`}
                        id="home-tab"
                        onClick={() => handleTabChange("home-tab")}
                        type="button"
                        role="tab"
                        aria-controls="home-tab-pane"
                        aria-selected={activeTab === "home-tab"}
                    >
                        Mostrar
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "profile-tab" ? "active" : ""}`}
                        id="profile-tab"
                        onClick={() => handleTabChange("profile-tab")}
                        type="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected={activeTab === "profile-tab"}
                    >
                        Crear
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "details-tab" ? "active" : ""}`}
                        id="details-tab"
                        onClick={() => handleTabChange("details-tab")}
                        type="button"
                        role="tab"
                        aria-controls="details-tab-pane"
                        aria-selected={activeTab === "details-tab"}
                    >
                        Detalles
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === "home-tab" ? "show active" : ""}`} id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                    <h3>Lista de Direcciones</h3>
                    <ul>
                        {direcciones.map((direccion) => (
                            <li key={direccion.id}>
                                {direccion.address}, {direccion.ciudad} - {direccion.codigoPostal}, {direccion.pais}
                                <button onClick={() => getToEditDireccion(direccion.id)} className="btn btn-warning btn-sm mx-2">Editar</button>
                                <button onClick={() => deleteDireccion(direccion.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                <button onClick={() => showDireccionDetails(direccion)} className="btn btn-info btn-sm mx-2">Mostrar Detalles</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`tab-pane fade ${activeTab === "profile-tab" ? "show active" : ""}`} id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    <h3>Crear Dirección</h3>
                    <form onSubmit={handleSubmitCreate}>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ingresa la dirección" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ciudad" className="form-label">Ciudad</label>
                            <input type="text" className="form-control" id="ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ingresa la ciudad" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                            <input type="text" className="form-control" id="codigoPostal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} placeholder="Ingresa el código postal" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pais" className="form-label">País</label>
                            <input type="text" className="form-control" id="pais" value={pais} onChange={(e) => setPais(e.target.value)} placeholder="Ingresa el país" required />
                        </div>
                        <button type="submit" className="btn btn-primary">Crear</button>
                    </form>
                </div>
                <div className={`tab-pane fade ${activeTab === "details-tab" ? "show active" : ""}`} id="details-tab-pane" role="tabpanel" aria-labelledby="details-tab" tabIndex="0">
                    <h3>Detalles de la Dirección</h3>
                    {selectedDireccion ? (
                        <div>
                            <p><strong>Dirección:</strong> {selectedDireccion.address}</p>
                            <p><strong>Ciudad:</strong> {selectedDireccion.ciudad}</p>
                            <p><strong>Código Postal:</strong> {selectedDireccion.codigoPostal}</p>
                            <p><strong>País:</strong> {selectedDireccion.pais}</p>
                            <button onClick={() => setSelectedDireccion(null)} className="btn btn-secondary">Volver</button>
                        </div>
                    ) : (
                        <p>No se ha seleccionado ninguna dirección.</p>
                    )}
                </div>
                <div className={`tab-pane fade ${activeTab === "edit-tab" ? "show active" : ""}`} id="edit-tab-pane" role="tabpanel" aria-labelledby="edit-tab" tabIndex="0">
                    <h3>Editar Dirección</h3>
                    <form onSubmit={handleSubmitEditDireccion}>
                        <div className="mb-3">
                            <label htmlFor="edit-address" className="form-label">Dirección</label>
                            <input type="text" className="form-control" id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ingresa la nueva dirección" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="edit-ciudad" className="form-label">Ciudad</label>
                            <input type="text" className="form-control" id="edit-ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ingresa la nueva ciudad" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="edit-codigoPostal" className="form-label">Código Postal</label>
                            <input type="text" className="form-control" id="edit-codigoPostal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} placeholder="Ingresa el nuevo código postal" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="edit-pais" className="form-label">País</label>
                            <input type="text" className="form-control" id="edit-pais" value={pais} onChange={(e) => setPais(e.target.value)} placeholder="Ingresa el nuevo país" required />
                        </div>
                        <button type="submit" className="btn btn-success">Guardar Cambios</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
