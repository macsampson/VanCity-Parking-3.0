import React from 'react'
import { LoadScript } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import SearchBar from './Searchbar'
import '../styles/Homepage.css'
import Button from '@mui/material/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocation,
  faLocationCrosshairs,
} from '@fortawesome/free-solid-svg-icons'

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        navigate('/parking', {
          state: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      })
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  return (
    <LoadScript googleMapsApiKey={key} libraries={libraries}>
      <div className='homepage'>
        <div className='content'>
          <img
            className='logo'
            src={process.env.PUBLIC_URL + '/images/logo.png'}
            alt='logo'
          />
          <h1 className='title'>ParkSmart</h1>
          <p className='subtitle'>Find parking in Vancouver</p>
          <div className='search-container'>
            <SearchBar
              className='searchBar'
              onSelectPlace={handleSelectedPlace}
            />

            <Button
              className='location-button'
              variant='contained'
              onClick={getCurrentLocation}
            >
              <FontAwesomeIcon icon={faLocationCrosshairs} size='lg' />
            </Button>
          </div>
        </div>
      </div>
    </LoadScript>
  )
}

export default Homepage
