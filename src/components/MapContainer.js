import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  LoadScript,
} from 'react-google-maps'

function MapContainer(props) {
  const dotenv = require('dotenv')
  dotenv.config()

  const key = process.env.REACT_APP_MAPS_API

  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 49.24966, lng: -123.11934 }}
      ></GoogleMap>
    ))
  )

  return (
    <MapWithAMarker
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  )
}

export default MapContainer
