import React, { useState } from 'react'
import './App.css'
// import Container from './components/Container'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import { LoadScript } from '@react-google-maps/api'
import { useEffect } from 'react'

const dotenv = require('dotenv')
dotenv.config()

const key = process.env.REACT_APP_MAPS_API

const libraries = ['places']

export default function App() {
	// Create a state object to hold the place data
	const [place, setPlace] = useState(null)
	// create a state object to hold meter type
	const [meterType, setMeterType] = useState('Any')
	// create a state object to hold the markers
	const [markers, setMarkers] = useState([])

	// create a state object to hold the clicked marker
	const [clickedMarker, setClickedMarker] = useState(null)

	// handle when a marker is clicked on the map
	const handleMarkerClick = (marker) => {
		console.log('marker clicked', marker.key)
		setClickedMarker(marker)
	}

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
				<Sidebar
					onMarkersChange={setMarkers}
					clickedMarker={clickedMarker}
				></Sidebar>
				<Map markers={markers} onMarkerClicked={handleMarkerClick} />
			</LoadScript>
		</main>
	)
}
