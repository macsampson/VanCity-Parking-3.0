import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './Searchbar'
import { LoadScript } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import '../styles/Homepage.css'
import Mapbox from './Mapbox'

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

  const styles = {
    title: {
      color: 'white',
    },
    subtitle: {
      color: 'white',
    },
  }

  return (
    <LoadScript googleMapsApiKey={key} libraries={libraries}>
      <div
        className='homepage'
        style={{
          // use bg.jpg image from images folder as background
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.jpg)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <h1 style={styles.title}>
          Vancouver Parking <span role={'img'}>🅿️</span>
        </h1>
        <p style={styles.subtitle}>Find parking near you</p>
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
