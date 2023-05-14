import React, { useState, useEffect, useCallback } from 'react'
import Map from './Map'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { LoadScript } from '@react-google-maps/api'
import { register as registerServiceWorker } from '../serviceWorker'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/ParkingPage.css'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

const key = process.env.REACT_APP_MAPS_API

const libraries = ['places']

export default function ParkingPage() {
	const [markers, setMarkers] = useState({})
	const [clickedMarker, setClickedMarker] = useState(null)
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [meter, setMeter] = useState(null)
	const [listOrMap, setListOrMap] = useState('map')

	const location = useLocation()
	const { state } = location

	const navigate = useNavigate()
	const goHome = useCallback(() => navigate('/'), [navigate])

	useEffect(() => {
		registerServiceWorker()
	}, [])

	useEffect(() => {
		if (state) {
			setSelectedPlace(state)
		}
	}, [state])

	const handleMarkerClick = useCallback((marker) => {
		setClickedMarker(marker)
	}, [])

	const handleMeterClick = useCallback((meter) => {
		setMeter(meter)
	}, [])

	const handleSelectedPlace = useCallback((place) => {
		if (place.geometry) {
			const lat = place.geometry.location.lat()
			const lng = place.geometry.location.lng()
			setSelectedPlace({ lat, lng })
		}
	}, [])

	const handleListButtonClick = useCallback(() => {
		setListOrMap('list')
	}, [])

	const handleMapButtonClick = useCallback(() => {
		setListOrMap('map')
	}, [])

	return (
		<LoadScript googleMapsApiKey={key} libraries={libraries}>
			<div className="parking-page">
				<div className="title">
					<span onClick={goHome}>
						<h1>ParkSmart</h1>
					</span>
				</div>

				<div className="body-container">
					<Sidebar
						className={listOrMap === 'list' ? 'sidebar' : 'sidebar-hidden'}
						onMarkersChange={setMarkers}
						clickedMarker={clickedMarker}
						clickedMeter={handleMeterClick}
						selectedPlace={selectedPlace}
					></Sidebar>
					<div
						className={
							listOrMap === 'map' ? 'map-container' : 'map-container-hidden'
						}
					>
						<Searchbar
							className={
								listOrMap === 'map'
									? 'searchbar-container'
									: 'searchbar-container-hidden'
							}
							onSelectPlace={handleSelectedPlace}
						/>
						<Map
							className={'map-views'}
							markers={markers}
							onMarkerClicked={handleMarkerClick}
							clickedMeter={meter}
							selectedPlace={selectedPlace}
						/>
					</div>

					<ButtonGroup
						className="mobile-views"
						variant="contained"
						aria-label="outlined button group"
					>
						<Button onClick={handleListButtonClick}>List</Button>
						<Button onClick={handleMapButtonClick}>Map</Button>
					</ButtonGroup>
				</div>
			</div>
		</LoadScript>
	)
}
