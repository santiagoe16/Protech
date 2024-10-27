import React, {useState, useEffect, useContext} from "react";
import { Context } from "../store/appContext";


export const ProductsBuyers = () => {
    const {store, actions} = useContext(Context)

    const [products, setProducts] = useState([])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [stock, setStock] = useState(0)
    const [image, setImage] = useState("")
    const [activeTab, setActiveTab] = useState("list-tab")
    const [Product_Id, setProduct_Id] = useState(0)

    const getProducts = ()=>{
        fetch( process.env.BACKEND_URL + "/api/products",{ method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setProducts(data)
        })
    }

    useEffect(() => {
        getProducts();
    }, []);
 
    const viewMore = (product_id)=>{
        fetch(process.env.BACKEND_URL + `/api/products/${product_id}`,{ method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            setActiveTab("view-more-tab");
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setStock(data.stock);
            setImage(data.image);
            setProduct_Id(product_id);
        })
    }
    return(
        <>
            <div className="container mt-5">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "list-tab" ? "active" : ""}`}
                            id="list-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#list-tab-pane"
                            type="button" role="tab"
                            aria-controls="list-tab-pane"
                            aria-selected={activeTab === "list-tab"}
                            onClick={() => setActiveTab("list-tab")}
                        >List</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "view-more-tab" ? "active" : "d-none"}`}
                            id="edit-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#view-more-tab-pane"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "view-more-tab"}
                        >View More</button>
                    </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${activeTab === "list-tab" ? "show active" : ""}`} id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab" tabIndex="0">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <td>View more</td>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ?
                                    (products.map((product, index) =>(
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="text-center">
                                                <i style={{cursor:"pointer"}}
                                                className="fas fa-eye"
                                                onClick={() => viewMore(product.id)}
                                                ></i>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price}$</td>
                                            <td>{product.stock}</td>
                                            <td>{product.image}</td>
                                        </tr>
                                    ))
                                    ):(<tr>There are no items in the table.</tr>)
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className={`tab-pane fade ${activeTab === "view-more-tab" ? "show active" : ""}`} id="view-more-tab-pane" role="tabpanel" aria-labelledby="view-more-tab" tabIndex="0">
                    <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>description</th>
                                    <th>price</th>
                                    <th>stock</th>
                                    <th>image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{price}$</td>
                                    <td>{stock}</td>
                                    <td>{image}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}