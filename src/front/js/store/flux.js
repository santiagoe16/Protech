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
