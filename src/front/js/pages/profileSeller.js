import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const ProfileSeller = () => {
  const [seller, setSeller] = useState(null);
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [editSellerId, setEditSellerId] = useState(null);
  const [activeTab, setActiveTab] = useState('view-tab');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const cloudName = "dqs1ls601";
  const presetName = "Protech";

  const getSellerProfile = async () => {
    const token = actions.verifyTokenSeller();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/profile/seller`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch seller data");
      
      setSeller(data);
      // También actualizar los estados individuales
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setImage(data.image);
      setBankAccount(data.bank_account);
      setEditSellerId(data.id);
    } catch (error) {
      console.error("Error fetching seller profile:", error);
      alert(error.message);
    }
  };

  const modifyProfileImage = async (profileId, imageUrl) => {
    const token = actions.verifyTokenSeller(); 
    if (!token) {
        console.error("No valid token found. User might need to log in.");
        return;
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/profile/image/${profileId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ image: imageUrl })
        });

        if (!response.ok) {
            throw new Error("Failed to modify profile image");
        }

        const data = await response.json();
        console.log("Profile image updated successfully:", data.message);
    } catch (error) {
        console.error("Error modifying profile image:", error);
    }
};

  const handleFileChange = async (e) => {
    if (!seller || !seller.id) {
      alert("No se puede actualizar la imagen sin ID de vendedor");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor selecciona una imagen válida (JPG, PNG o GIF)");
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("La imagen no debe exceder 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);

    try {
      // Subir a Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData
        }
      );
      // const data = await uploadResponse.json();
      // const imageUrl2 = data.secure_url;

      // console.log("hola" + JSON.stringify(data));

      // await modifyProfileImage(seller.id, imageUrl);

      if (!uploadResponse.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.secure_url;

      // Actualizar en el backend
      const token = actions.verifyTokenSeller();
      
      console.log('Id: ' + seller.id); 
      console.log('process.env.BACKEND_URL ' + process.env.BACKEND_URL);
      console.log('imageUrl ' + imageUrl); 
      console.log(' json imageUrl ' + JSON.stringify("image_url", imageUrl)); 
      console.log('typeof imageUrl ' + typeof(imageUrl)); 
      
      
      const updateResponse = await fetch(
        `${process.env.BACKEND_URL}/api/seller/image/${seller.id}`, ////
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image_url: imageUrl })
        }
      );

      console.log("AAAAAAAAAAAAA");
      

      if (!updateResponse.ok) {
        throw new Error("Error al actualizar la imagen en el servidor");
      }

      const updateData = await updateResponse.json();
      setSeller(prev => ({ ...prev, image: imageUrl }));
      alert("Imagen actualizada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editSellerId) {
      alert("ID de vendedor no válido");
      return;
    }

    console.log("jsdfkjsdkfjsdkjfh" + image);
    
    const updatedSeller = {
      name,
      email,
      phone,
      bank_account: bankAccount,
      image
      
    };

    const token = actions.verifyTokenSeller();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/seller/${editSellerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSeller),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar el perfil');

      setSeller(data.seller);
      setActiveTab("view-tab");
      alert("Perfil actualizado correctamente");
      getSellerProfile(); // Recargar los datos actualizados
    } catch (error) {
      console.error("Error updating seller:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    getSellerProfile();
  }, []);

  return (
    <div className="container mt-4">
      {seller ? (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Perfil del Vendedor</h4>
            {activeTab === "view-tab" && (
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab("edit-tab")}
              >
                <i className="fas fa-edit me-2"></i>
                Editar Perfil
              </button>
            )}
          </div>

          <div className="card-body">
            {activeTab === "view-tab" && (
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <img
                    src={seller.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1730875251/o7ausoaj0yrtp3zezisj.png"}
                    alt={seller.name}
                    className="img-fluid rounded-circle mb-2"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <strong>Nombre:</strong> {seller.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {seller.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Teléfono:</strong> {seller.phone}
                    </li>
                    <li className="list-group-item">
                      <strong>Cuenta Bancaria:</strong> {seller.bank_account}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "edit-tab" && (
              <form onSubmit={handleSubmitEdit}>
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    {/* <img
                      src={seller.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1730875251/o7ausoaj0yrtp3zezisj.png"}
                      alt={seller.name}
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    /> */}
                     <img
                        src={seller.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1730875251/o7ausoaj0yrtp3zezisj.png"}
                        alt={seller.name}
                        style={{ width: "100px" }}
                      />
                    <div className="mb-3">
                      <label className="btn btn-outline-primary">
                        {isUploading ? "Subiendo..." : "Cambiar Imagen"}
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="d-none"
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        id="name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="email"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Teléfono</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        id="phone"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bank_account" className="form-label">Cuenta Bancaria</label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="form-control"
                        id="bank_account"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab("view-tab")}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isUploading}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};