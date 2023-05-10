import React from 'react'
import { LoadScript } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import SearchBar from './Searchbar'
import '../styles/Homepage.css'
import dotenv from 'dotenv'

dotenv.config()
const key = process.env.REACT_APP_MAPS_API
const libraries = ['places']

function Homepage() {
	const navigate = useNavigate()

	const handleSelectedPlace = (place) => {
		navigate('/parking', {
			state: {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			},
		})
	}

	return (
		<LoadScript googleMapsApiKey={key} libraries={libraries}>
			<div className="homepage">
				<div className="content">
					<img
						className="logo"
						src={process.env.PUBLIC_URL + '/images/logo.png'}
						alt="logo"
					/>
					<h1 className="title">ParkSmart</h1>
					<p className="subtitle">Find parking in Vancouver</p>
					<SearchBar
						className="searchBar"
						onSelectPlace={handleSelectedPlace}
					/>
				</div>
			</div>
		</LoadScript>
	)
}

export default Homepage
