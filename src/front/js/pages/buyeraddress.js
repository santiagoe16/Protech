import React, { useRef, useState, useEffect, useContext } from "react";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Context } from "../store/appContext";

const libraries = ["places"];
const defaultCenter = { lat: 4.570868, lng: -74.297333 };

export const BuyerAddress = () => {
    const { store, actions } = useContext(Context);
    const [map, setMap] = useState(null);
    const inputRef = useRef(null);
    const [currentAddress, setCurrentAddress] = useState([]);
    const markerRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [buyerAddress, setBuyerAddress] = useState({
        address: "",
        lat: 0,
        lon: 0,
    });

    useEffect(() => {
        getCurrentAddress();
    }, []);

    useEffect(() => {
        if (map) {
            initAutocomplete();
        }
    }, [map]);

    const getCurrentAddress = () => {
        const token = actions.verifyTokenBuyer()
        fetch(process.env.BACKEND_URL + "/api/address/buyer", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCurrentAddress(data);
            });
    };
    
    const deleteAddress = (addressId) => {
        const token = actions.verifyTokenBuyer()
        fetch(process.env.BACKEND_URL + "/api/address/buyer/" + addressId, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                getCurrentAddress();
            });
    };

    const updateBuyerAddress = () => {
        const token = actions.verifyTokenBuyer()
        
        if (buyerAddress.address) {
            
            const raw = JSON.stringify({
                address: buyerAddress.address,
                lat: buyerAddress.lat,
                lon: buyerAddress.lon,
            });

            fetch(`${process.env.BACKEND_URL}/api/address/buyer`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: raw,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(() => {
                    getCurrentAddress(); 
                })
                .catch((error) => console.error("Error:", error));
        }
    };

    const initAutocomplete = () => {
        const input = inputRef.current;

        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };

        const autocomplete = new window.google.maps.places.Autocomplete(input, options);
        autocomplete.bindTo("bounds", map);

        const marker = new window.google.maps.Marker({
            map,
            anchorPoint: new window.google.maps.Point(0, -29),
        });
        markerRef.current = marker;

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                alert("No details available for input: '" + place.name + "'");
                return;
            }

            const location = place.geometry.location;
            setMarkerPosition(location);

            setBuyerAddress({
                address: place.formatted_address,
                lat: parseFloat(location.lat()),
                lon: parseFloat(location.lng()),
            });

            map.panTo(location);
            marker.setPosition(location);
            marker.setVisible(true);
            setSelectedPlace(place);
        });

        map.addListener("click", (event) => {
            const clickedLocation = event.latLng;
            setMarkerPosition(clickedLocation);
            marker.setPosition(clickedLocation);
            marker.setVisible(true);
            setSelectedPlace(null);

            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLocation.lat()},${clickedLocation.lng()}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "OK" && data.results[0]) {
                        const newAddress = data.results[0].formatted_address;
                        setBuyerAddress({
                            address: newAddress,
                            lat: parseFloat(clickedLocation.lat()),
                            lon: parseFloat(clickedLocation.lng()),
                        })

                        setSelectedPlace({
                            name: "Selected Location",
                            formatted_address: newAddress,
                            geometry: { location: clickedLocation },
                        });
                    } else {
                        console.error("Geocoding failed: " + data.status);
                    }
                })
                .catch((error) => console.error("Error fetching geocode:", error));
        });
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }} className="mt-5 mb-4 container ">
            {currentAddress.length > 0 ? (
                currentAddress.map((address) => (
                    <div key={address.id} style={{ width: "90%" }} className="p-3 bg-light d-flex mb-2 align-items-center">
                        <i className="fas fa-trash ms-3" style={{ cursor: "pointer" }} onClick={() => deleteAddress(address.id)}></i>
                        <h5 className="ms-4 mb-0">
                            Address: {address.address}
                        </h5>
                    </div>
                ))
            ) : (
                <h5>Without addresses</h5>
            )}
                
            </div>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={libraries}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div id="pac-card">
                        <input
                            id="pac-input"
                            ref={inputRef}
                            type="text"
                            placeholder="Enter a location"
                            style={{ width: "400px", padding: "8px", marginBottom: "10px" }}
                        />
                        <button className="ms-3 p-2 btn btn-primary" onClick={updateBuyerAddress}>
                            Add Address
                        </button>
                    </div>
                    <GoogleMap
                        id="map"
                        mapContainerStyle={{ height: "500px", width: "60%" }}
                        center={markerPosition}
                        zoom={13}
                        onLoad={(mapInstance) => setMap(mapInstance)}
                    >
                        <Marker position={markerPosition} />

                        {selectedPlace && (
                            <InfoWindow position={markerPosition} onCloseClick={() => setSelectedPlace(null)}>
                                <div>
                                    <h2>{selectedPlace.name}</h2>
                                    <p>{selectedPlace.formatted_address}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </LoadScript>
        </div>
    );
};