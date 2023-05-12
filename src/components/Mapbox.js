import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useEffect, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

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
    const map = new mapboxgl.Map({
      container: 'mapbox', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
    })
  })

  return <div id='mapbox' className='mapbox-container' />
}
