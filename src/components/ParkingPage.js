import React, { useState, useEffect } from 'react'
import Map from './Map'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { LoadScript } from '@react-google-maps/api'
import { register as registerServiceWorker } from '../serviceWorker'
import { useLocation } from 'react-router-dom'
import '../styles/ParkingPage.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useNavigate } from 'react-router-dom'

const dotenv = require('dotenv')
dotenv.config()

const key = process.env.REACT_APP_MAPS_API

const libraries = ['places']

export default function ParkingPage() {
	const [markers, setMarkers] = useState({})
	const [clickedMarker, setClickedMarker] = useState(null)
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [meter, setMeter] = useState(null)

	const location = useLocation()
	const { state } = location

	const navigate = useNavigate()

	useEffect(() => {
		registerServiceWorker()
	}, [])

	// handle when a marker is clicked on the map
	const handleMarkerClick = (marker) => {
		// console.log('marker clicked', marker.key)
		setClickedMarker(marker)
	}

	const handleMeterClick = (meter) => {
		// console.log("meter clicked", meter);
		setMeter(meter)
	}

	// handle selected place from searchbar
	const handleSelectedPlace = (place) => {
		// console.log('place selected', place)
		// get lat and lng from place
		if (place.geometry) {
			const lat = place.geometry.location.lat()
			const lng = place.geometry.location.lng()
			// set selected place
			setSelectedPlace({ lat, lng })
		}
	}

	const goHome = () => {
		navigate('/')
	}

	// use effect to set selected place when it changes
	useEffect(() => {
		if (state) {
			setSelectedPlace(state)
		}
	}, [state])

	const styles = {
		search: {
			// flex: '0 0 auto',
			padding: '10px',
			zIndex: 1,
			position: 'absolute',
			right: '0px',
			width: '50vw',
		},
	}

	return (
		<LoadScript googleMapsApiKey={key} libraries={libraries}>
			<AppBar
				position="static"
				style={{ backgroundColor: 'rgb(81, 209, 251)', zIndex: '1' }}
			>
				<Toolbar style={{ display: 'flex', justifyContent: 'left' }}>
					<span style={{ cursor: 'pointer' }} onClick={goHome}>
						{/* <img src="/images/logo.png" alt="logo" width="50px" /> */}
						<h1 style={{ color: 'white' }}>ParkSmart</h1>
					</span>
				</Toolbar>
			</AppBar>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				{/* <SearchBar onSelectedPlace={setSelectedPlace} /> */}{' '}
				<div className="searchbar-container" style={styles.search}>
					<Searchbar onSelectPlace={handleSelectedPlace} />
				</div>
				<Sidebar
					onMarkersChange={setMarkers}
					clickedMarker={clickedMarker}
					clickedMeter={handleMeterClick}
					selectedPlace={selectedPlace}
				></Sidebar>
				<Map
					markers={markers}
					onMarkerClicked={handleMarkerClick}
					clickedMeter={meter}
					selectedPlace={selectedPlace}
				/>
			</div>
		</LoadScript>
	)
}
