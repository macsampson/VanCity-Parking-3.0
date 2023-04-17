import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'

const dotenv = require('dotenv')
dotenv.config()

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

const center = {
	lat: 49.2827,
	lng: -123.1207,
}

export default function Mapbox() {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState(center.lng)
	const [lat, setLat] = useState(center.lat)
	const [zoom, setZoom] = useState(9)
	const [markers, setMarkers] = useState([])
	const [clickedMarker, setClickedMarker] = useState(null)
	const [locationMarker, setLocationMarker] = useState(null)

	useEffect(() => {
		if (map.current) return // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom,
		})
	})

	return (
		<div>
			<div ref={mapContainer} className="map-container" />
		</div>
	)
}
