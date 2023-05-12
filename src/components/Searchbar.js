import React, { useState } from 'react'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import { FormControl } from '@mui/material'
import { Autocomplete } from '@react-google-maps/api'
import '../styles/SearchBar.css'

// const key = process.env.REACT_APP_MAPS_API
// const libraries = ['places']

// create bounds object for autocomplete search within vancouver
const bounds = {
  north: 49.3755,
  south: 49.0071,
  west: -123.3659,
  east: -122.5765,
}

function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState('')

  const [autocomplete, setAutocomplete] = useState(null)

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      setSearchTerm(place.formatted_address)
      props.onSelectPlace(place)
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    // <LoadScript googleMapsApiKey={key} libraries={libraries}>
    <FormControl className={props.className}>
      <div className='search' style={{ background: 'white' }}>
        <div className='search-icon'>
          <SearchIcon />
        </div>

        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            bounds: bounds,
          }}
        >
          <InputBase
            // id="autocomplete"
            placeholder='Search…'
            value={searchTerm}
            onChange={handleChange}
            classes={{
              root: 'input-root',
              input: 'input-input',
            }}
            inputProps={{ 'aria-label': 'search' }}
            autoFocus={true}
          />
        </Autocomplete>
        {searchTerm && searchTerm.length > 0 && (
          <div className='clear-icon' onClick={handleClear}>
            <ClearIcon />
          </div>
        )}
      </div>
    </FormControl>
    // </LoadScript>
  )
}

export default SearchBar
