import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	StreetViewPanorama,
	//   DistanceMatrixService,
} from '@react-google-maps/api'

import '../styles/Map.css'

const key = process.env.REACT_APP_MAPS_API
const libraries = ['places']

const center = {
	lat: 49.2827,
	lng: -123.1207,
}

// const clickedIcon = '/images/clicked-meter.png'
const clickedIcon2 = '/images/selected-meter.png'
const parkingIcon = '/images/parking-meter.png'
const destinationIcon = '/images/destination.png'
// const flagIcon = '/images/flag.png'

function Map(props) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: key,
		libraries: libraries,
	})

	const [map, setMap] = useState(null)
	const [markersData, setMarkersData] = useState([])
	const [clickedMarker, setClickedMarker] = useState(null)
	// const [markers, setMarkers] = useState([]) // probably dont need
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [locationMarker, setLocationMarker] = useState(null)

	// useffect to update selected place when it changes

	useEffect(() => {
		if (props.selectedPlace) {
			// setLocationMarker(
			// 	<Marker position={props.selectedPlace} icon={destinationIcon} />
			// )
			setSelectedPlace(props.selectedPlace)
			setClickedMarker(null)
		}
	}, [props.selectedPlace])

	// use effect to console log when meter prop changes
	useEffect(() => {
		// console.log('meter changed', props.clickedMeter)
		// console.log('markers', markers)
		if (props.clickedMeter) {
			handleMarkerClick(props.clickedMeter)
		}
	}, [props.clickedMeter])

	// update markers when props change
	useEffect(() => {
		// console.log('props changed', props.markers)
		setMarkersData(props.markers)
		// console.log('markers in map: ', markers)
	}, [props.markers])

	// useffect to pan to clicked marker when clicked
	useEffect(() => {
		if (clickedMarker) {
			const marker = markersData[clickedMarker]
			const newPosition = { lat: marker.lat, lng: marker.lng }
			map.panTo(newPosition)
			// console.log('panning to:', newPosition)
			map.setZoom(19)
		}
	}, [clickedMarker])

	// function to zoom map and pan smoothly to marker when clicked
	function handleMarkerClick(markerId) {
		setClickedMarker(markerId)
		props.onMarkerClicked(markerId)
	}

	function getMarkers() {
		if (map) {
			const bounds = new window.google.maps.LatLngBounds()
			let markers = []
			// console.log('rendering markers')
			// iterate through markersData object and create markers
			Object.entries(markersData).forEach(([key, marker]) => {
				const position = { lat: marker.lat, lng: marker.lng }
				bounds.extend(position)
				markers.push(
					<Marker
						key={key}
						position={position}
						icon={key === clickedMarker ? clickedIcon2 : parkingIcon}
						onClick={() => handleMarkerClick(key)}
					/>
				)
			})
			if (selectedPlace) {
				markers.push(<Marker position={selectedPlace} icon={destinationIcon} />)
				bounds.extend(selectedPlace)
			}
			map.fitBounds(bounds)
			return markers
		}
	}

	const renderMarkers = useMemo(() => getMarkers(), [
		markersData,
		clickedMarker,
		selectedPlace,
	])

	// set the map state object to the map argument
	const onLoad = useCallback((map) => {
		setMap(map)
	}, [])

	if (loadError) return <p>Error loading map</p>
	if (!isLoaded) return <p>Loading map</p>

	return (
		isLoaded && (
			<div className={props.className}>
				<GoogleMap
					mapContainerClassName="map"
					// mapContainerStyle={mapStyle}
					center={center}
					// zoom={15}
					onLoad={onLoad}
					options={{
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						zoomControl: false,
						styles: [
							{
								featureType: 'poi',
								elementType: 'labels',
								stylers: [{ visibility: 'off' }],
							},
						],
					}}
				>
					{renderMarkers}
				</GoogleMap>

				{clickedMarker && (
					<GoogleMap mapContainerClassName="street-view">
						<StreetViewPanorama
							position={markersData[clickedMarker]}
							visible={true}
							options={{
								zoom: 0,
								addressControl: false,
								fullscreenControl: false,
								motionTracking: false,
								zoomControl: false,
								linksControl: false,
								panControl: false,
								enableCloseButton: false,
								scrollwheel: true,
								showRoadLabels: false,
								bestGuess: true,
								source: window.google.maps.StreetViewSource.OUTDOOR,
							}}
						/>
					</GoogleMap>
				)}
			</div>
		)
	)
}

export default Map
