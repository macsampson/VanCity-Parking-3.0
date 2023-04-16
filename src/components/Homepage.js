import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './Searchbar'
import { LoadScript } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'

const dotenv = require('dotenv')
dotenv.config()

const key = process.env.REACT_APP_MAPS_API

const libraries = ['places']

function Homepage() {
	const navigate = useNavigate()

	const handleSelectedPlace = (place) => {
		// push the lat and lng from place to the navigation state
		navigate('/parking', {
			state: {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			},
		})
	}

	return (
		<LoadScript googleMapsApiKey={key} libraries={libraries}>
			<div
				className="homepage"
				style={{
					background: 'aquamarine',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<h1>Vancouver Parking 🅿️</h1>
				<p>Find parking near you</p>
				<div
					style={{
						width: '50vw',
					}}
				>
					<SearchBar onSelectPlace={handleSelectedPlace} />
				</div>
			</div>
		</LoadScript>
	)
}

export default Homepage
