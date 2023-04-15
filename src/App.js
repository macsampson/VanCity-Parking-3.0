import React, { useState, useEffect } from "react";
import "./App.css";
// import Container from './components/Container'
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import { LoadScript } from "@react-google-maps/api";
import SearchBar from "./components/Searchbar";
import { register as registerServiceWorker } from "./serviceWorker";

const dotenv = require("dotenv");
dotenv.config();

const key = process.env.REACT_APP_MAPS_API;

const libraries = ["places"];

export default function App() {
  // Create a state object to hold the place data
  // const [place, setPlace] = useState(null)
  // // create a state object to hold meter type
  // const [meterType, setMeterType] = useState('Any')
  // create a state object to hold the markers
  const [markers, setMarkers] = useState([]);

  // create a state object to hold the clicked marker
  const [clickedMarker, setClickedMarker] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // handle when a marker is clicked on the map
  const handleMarkerClick = (marker) => {
    console.log("marker clicked", marker.key);
    setClickedMarker(marker);
  };

  const handleMeterClick = (meter) => {
    console.log("meter clicked", meter);
  };

  // call the fetchParkingMeters function when place prop changes
  //   useEffect(() => {
  //     if (selectedPlace) {
  //       fetchParkingMeters();
  //     }
  //   }, [selectedPlace, meterType]);

  // function handlePlaceSelected(place) {
  // 	console.log('Place selected:', place)
  // 	setPlace(place)
  // }

  // function handleMeterTypeChange(meterType) {
  // 	console.log('Meter type selected:', meterType)
  // 	setMeterType(meterType)
  // }

  // useEffect(() => {
  // 	console.log('markers', markers)
  // }, [markers])

  return (
    <main>
      <LoadScript googleMapsApiKey={key} libraries={libraries}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <SearchBar onSelectedPlace={setSelectedPlace} /> */}
          <Sidebar
            onMarkersChange={setMarkers}
            clickedMarker={clickedMarker}
            clickedMeter={handleMeterClick}
          ></Sidebar>
          <Map markers={markers} onMarkerClicked={handleMarkerClick} />
        </div>
      </LoadScript>
    </main>
  );
}
