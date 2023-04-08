import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	useGoogleMap,
} from '@react-google-maps/api'

const containerStyle = {
	width: '100%',
	height: '100%',
	position: 'absolute',
}

const center = {
	lat: 49.2827,
	lng: -123.1207,
}

function Map(props) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_MAPS_API,
		libraries: props.libraries,
	})

	// create a state object to hold the map
	const [map, setMap] = useState(null)

	// create state to hold markers
	const [markers, setMarkers] = useState([])

	// update markers when props change
	useEffect(() => {
		setMarkers(props.markers)
	}, [props.markers])

	// function to zoom map and pan smoothly to marker when clicked
	function handleMarkerClick(marker) {
		const newPosition = { lat: marker.lat, lng: marker.lng }
		map.panTo(newPosition)

		map.setZoom(20)
		props.onMarkerClicked(marker)
	}

	// Memoize the renderMarkers function to avoid unnecessary re-renders
	const renderMarkers = useMemo(() => {
		const bounds = new window.google.maps.LatLngBounds()
		if (markers.length === 0) {
			return null
		}
		const markersWithBounds = markers.map((marker) => {
			const position = { lat: marker.lat, lng: marker.lng }
			// console.log('position', position)
			bounds.extend(position)
			return (
				<Marker
					key={marker.key}
					position={position}
					icon={'/images/parking-meter.png'}
					onClick={() => handleMarkerClick(marker)}
				/>
			)
		})
		if (map) {
			map.fitBounds(bounds)
		}
		return markersWithBounds
	}, [markers, map])

	// set the map state object to the map argument
	const onLoad = useCallback(function callback(map) {
		// const bounds = new window.google.maps.LatLngBounds()
		// map.fitBounds(bounds)
		setMap(map)
	}, [])

	if (loadError) return <p>Error loading map</p>
	if (!isLoaded) return <p>Loading map</p>

	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={center}
			zoom={15}
			onLoad={onLoad}
			// options={options}
		>
			{renderMarkers}
		</GoogleMap>
	)
}

export default Map
