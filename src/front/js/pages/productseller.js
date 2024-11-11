import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const ProductsSeller = () => {
  const { store, actions } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("list-tab");
  const [categoryId, setCategoryId] = useState(0);
  const [editProduct_Id, setEditProduct_Id] = useState(0);
  const navigate = useNavigate();

  const cloudName = "dqs1ls601";
  const presetName = "Protech";

  const getProducts = () => {
    const token = actions.verifyTokenSeller();

    if (!token) {
      console.error("No valid token found. User might need to log in.");
      navigate("/login");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${process.env.BACKEND_URL}/api/products/seller`, requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  };

  const getCategories = () => {
    fetch(`${process.env.BACKEND_URL}/api/categorias`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const cleanFields = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setStock(0);
    setImage("");
    setCategoryId(0);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const raw = JSON.stringify({
      name,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      image,
      category_id: categoryId
    });

    const token = actions.verifyTokenSeller();

    if (!token) {
      console.error("No valid token found. User might need to log in.");
      return;
    }

    fetch(`${process.env.BACKEND_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: raw
    })
      .then(() => {
        getProducts();
        setActiveTab("list-tab");
        cleanFields();
      })
      .catch((error) => console.error("Error creating product:", error));
  };

  const getToEdit = (product_id) => {
    fetch(`${process.env.BACKEND_URL}/api/products/${product_id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setActiveTab("edit-tab");
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setImage(data.image);
        setEditProduct_Id(product_id);
        setCategoryId(data.category.id);
      });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const raw = JSON.stringify({
      name,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      image,
      category_id: categoryId
    });

    fetch(`${process.env.BACKEND_URL}/api/products/${editProduct_Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: raw
    })
      .then(() => {
        getProducts();
        cleanFields();
        setActiveTab("list-tab");
      })
      .catch((error) => console.error(error));
  };

  const viewMore = (product_id) => {
    fetch(`${process.env.BACKEND_URL}/api/products/${product_id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setActiveTab("view-more-tab");
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setImage(data.image);
        setCategoryId(data.category.id);
      });
  };

  const deleteProduct = (product_id) => {
    fetch(`${process.env.BACKEND_URL}/api/products/${product_id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          getProducts();
        } else {
          console.error("Error deleting product:", response.statusText);
        }
      })
      .catch((error) => console.error("Network error:", error));
  };

  const updateProductImageInDB = async (productId, imageUrl) => {
    const token = actions.verifyTokenSeller();
    if (!token) {
      console.error("No valid token found. User might need to log in.");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products/${productId}/update-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ image_url: imageUrl })
      });

      if (!response.ok) {
        throw new Error("Failed to update product image in the database");
      }

      const data = await response.json();
      console.log("Product image updated in database:", data);
    } catch (error) {
      console.error("Error updating product image in DB:", error);
    }
  };
const handleFileChange = async (e, productId) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", presetName);
    
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            });
    
            const data = await response.json();
            const imageUrl = data.secure_url;

            console.log("hola" + JSON.stringify(data));
            

            await modifyProductImage(productId, imageUrl);
            
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, image: imageUrl } : product
                )
            );
    
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const modifyProductImage = async (productId, imageUrl) => {
        const token = actions.verifyTokenSeller(); 
        if (!token) {
            console.error("No valid token found. User might need to log in.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/products/image/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ image: imageUrl })
            });
    
            if (!response.ok) {
                throw new Error("Failed to modify product image");
            }
    
            const data = await response.json();
            console.log("Product image updated successfully:", data.message);
        } catch (error) {
            console.error("Error modifying product image:", error);
        }
    };


  useEffect(() => {
    const token = actions.verifyTokenSeller();
    if (!token) {
      navigate("/login");
    } else {
      getProducts();
      getCategories();
    }
  }, []);

  return (
    <div className="container mt-5">
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
        My Products
      </h2>

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "list-tab" ? "active" : ""}`}
            id="list-tab"
            data-bs-toggle="tab"
            data-bs-target="#list-tab-pane"
            type="button"
            role="tab"
            aria-controls="list-tab-pane"
            aria-selected={activeTab === "list-tab"}
            onClick={() => setActiveTab("list-tab")}
          >
            List
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "edit-tab" ? "active" : "d-none"}`}
            id="edit-tab"
            data-bs-toggle="tab"
            data-bs-target="#edit-tab-pane"
            type="button"
            role="tab"
            aria-selected={activeTab === "edit-tab"}
          >
            Edit
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "view-more-tab" ? "active" : "d-none"}`}
            id="view-more-tab"
            data-bs-toggle="tab"
            data-bs-target="#view-more-tab-pane"
            type="button"
            role="tab"
            aria-selected={activeTab === "view-more-tab"}
          >
            View More
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "create-tab" ? "active" : ""}`}
            id="create-tab"
            data-bs-toggle="tab"
            data-bs-target="#create-tab-pane"
            type="button"
            role="tab"
            aria-controls="create-tab-pane"
            aria-selected={activeTab === "create-tab"}
            onClick={() => {
              setActiveTab("create-tab");
              cleanFields();
            }}
          >
            Create
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div className={`tab-pane fade ${activeTab === "create-tab" ? "show active" : ""}`} id="create-tab-pane" role="tabpanel" aria-labelledby="create-tab" tabIndex="0">
          <form className="mt-4 ms-5" onSubmit={handleSubmitCreate}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" id="description" />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" id="price" />
            </div>
            <div className="mb-3">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" id="stock" />
            </div>
            <div className="mb-3">
            <label htmlFor="image" className="form-label">Image</label>
            <input type="file" onChange={(e) => handleFileChange(e, 0)} className="form-control" id="image" />
          </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-select" id="category">
                <option value="0">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Create Product</button>
          </form>
        </div>

        <div className={`tab-pane fade ${activeTab === "edit-tab" ? "show active" : ""}`} id="edit-tab-pane" role="tabpanel" aria-labelledby="edit-tab" tabIndex="0">
          <form className="mt-4 ms-5" onSubmit={handleSubmitEdit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" id="description" />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" id="price" />
            </div>
            <div className="mb-3">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" id="stock" />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <td>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleFileChange(e, product.id)}
  />
</td>
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-select" id="category">
                <option value="0">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Edit Product</button>
          </form>
        </div>

        <div className={`tab-pane fade ${activeTab === "view-more-tab" ? "show active" : ""}`} id="view-more-tab-pane" role="tabpanel" aria-labelledby="view-more-tab" tabIndex="0">
          <div className="mt-4 ms-5">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <img
                        src={product.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1730875251/o7ausoaj0yrtp3zezisj.png"}
                        alt={product.name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, product.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === "list-tab" ? "show active" : ""}`} id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab" tabIndex="0">
          {products.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Actions</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      <i className="fas fa-edit me-3" style={{ cursor: "pointer" }} onClick={() => getToEdit(product.id)}></i>
                      <i className="fas fa-trash me-3" style={{ cursor: "pointer" }} onClick={() => deleteProduct(product.id)}></i>
                      <i className="fas fa-eye" style={{ cursor: "pointer" }} onClick={() => viewMore(product.id)}></i>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <img
                        src={product.image || "https://res.cloudinary.com/dqs1ls601/image/upload/v1730875251/o7ausoaj0yrtp3zezisj.png"}
                        alt={product.name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, product.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products found for this seller.</p>
          )}
        </div>
      </div>
    </div>
  );
};
