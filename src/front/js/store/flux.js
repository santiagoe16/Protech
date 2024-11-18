const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			authenticatedBuyer: false,
			authenticatedSeller:false,
			sellerId: null,
			products:[

			],
			selectedProduct: {} ,
			amounts: {},
			cart: {}
		},
		actions: {
			verifyTokenBuyer: () => {
				const token = localStorage.getItem('jwt-token-buyer');

				if(token != null){
					setStore({ authenticatedBuyer: true })
					return(token)
				}
			},
			changeAuthenticatedBuyer: (bool) => {
				setStore({authenticatedBuyer: bool})
			},
			verifyTokenSeller: () => {
				const token = localStorage.getItem('jwt-token-seller');
				
				
				if (token != null) {
					setStore({ authenticatedSeller: true });
					return(token)
				}
			},
			
			
			changeAuthenticatedSeller: (bool) => {
				setStore({authenticatedSeller: bool})
			},

			getProductsFlux: () => {
				return fetch(process.env.BACKEND_URL + "/api/products", { method: "GET" })
					.then((response) => response.json())
					.then((data) => {
						setStore({ products: data });
			
						const initialAmounts = {};
						data.forEach(product => {
							initialAmounts[product.id] = 1;
						});
						setStore({ amounts: initialAmounts });
			
						return data; 
					})
					.catch((error) => {
						console.error(error);
						throw error; 
					});
			},
			getCart: async () => {
				const token = localStorage.getItem("jwt-token-buyer");
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/buyer/cart/products", {
						headers: { Authorization: `Bearer ${token}` }
					});
					const data = await (response.ok ? response.json() : Promise.reject(response.statusText));
					console.log("obenido");
					console.log(data);
					
					return setStore({ 
						cart: data,
						items: data.items,
						total_price: data.total_price
					});
				} catch (error) {
					return console.error("Error fetching cart items:", error);
				}
			},
			handleAmountChangeflux: (productId, value) => {
				const store = getStore();
				const newAmount = value === "" ? "" : Math.max(1, parseInt(value));

				setStore({
					amounts: {
						...store.amounts,
						[productId]: newAmount
					}
				});
			},
			updateCartItemAmount: (itemId, newAmount) => {
				const store = getStore();
			
				// Actualizar la cantidad de items en el carrito
				const updatedItems = store.cart.items.map(item => {
					if (item.item_id === itemId) {
						return { ...item, amount: newAmount };
					}
					return item;
				});
			
				// Calcular el nuevo precio total
				const total_price = updatedItems.reduce((acc, item) => acc + (item.product.price * item.amount), 0);
			
				// Actualizar el store con los items y el nuevo total_price
				setStore({
					cart: {
						...store.cart,
						items: updatedItems,
						total_price: total_price
					}
				});
			
				// Realizar la petición PUT para actualizar el carrito en el backend
				const token = localStorage.getItem("jwt-token-buyer");
				fetch(`${process.env.BACKEND_URL}/api/buyer/cart/products/${itemId}`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ 
						amount: newAmount,
						total_price: total_price // Mandar el nuevo total al backend
					}),
				})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Error updating item quantity: " + response.statusText);
					}
					return response.json();
				})
				.then((result) => {
					console.log("Carrito actualizado correctamente");
				})
				.catch((error) => {
					console.error("Error updating item quantity:", error);
				});
			},
			

            addToCartFlux: (productId) => {
                const store = getStore();
                const token = localStorage.getItem("jwt-token-buyer");
                const amount = store.amounts[productId] || 1; 

                const raw = JSON.stringify({
                    amount: amount,
                    product_id: productId
                });

                return fetch(process.env.BACKEND_URL + "/api/itemscarts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: raw
                })
                    .then((response) => response.json())
                    .then((result) => {
                        getActions().getProductsFlux(); 
                    })
                    .catch((error) => console.error("Error al agregar al carrito:", error));
            },

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
