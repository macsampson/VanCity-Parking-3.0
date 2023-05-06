import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  StreetViewPanorama,
  //   DistanceMatrixService,
} from '@react-google-maps/api'
// import { CloseFullscreen } from '@mui/icons-material'

const center = {
  lat: 49.2827,
  lng: -123.1207,
}

// const dividerStyle = {
//   position: 'absolute',

//   width: '100%',
//   height: '2px',
//   top: 'calc(80%)',
//   left: '0px',
//   right: '0px',
//   backgroundColor: 'black',
//   cursor: 'ns-resize',
// }

const streetViewStyle = {
  position: 'absolute',
  top: '75%',
  left: '400px',
  right: '0%',
  bottom: '0%',
}

// const clickedIcon = '/images/clicked-meter.png'
const parkingIcon = '/images/parking-meter.png'

function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API,
    libraries: props.libraries,
  })

  // create a state object to hold the map
  const [map, setMap] = useState(null)

  // create state to hold markers
  const [markers, setMarkers] = useState([])
  // state to hold clicked marker
  const [clickedMarker, setClickedMarker] = useState(null)

  // state for location marker
  //   const [locationMarker, setLocationMarker] = useState(null)

  const mapStyle = {
    width: 'auto',
    position: 'absolute',
    // maxHeight: '75%',
    top: '0px',
    left: '400px',
    right: '0px',
    bottom: clickedMarker ? '25%' : '0%',
  }

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
    setMarkers(props.markers)
    // console.log('markers in map: ', markers)
  }, [props.markers])

  // function to zoom map and pan smoothly to marker when clicked
  function handleMarkerClick(markerId) {
    setClickedMarker(markerId)
    const marker = markers[markerId]
    const newPosition = { lat: marker.lat, lng: marker.lng }
    map.panTo(newPosition)

    map.setZoom(20)
    // props.onMarkerClicked(marker)
  }

  // function to get correct icon image depending if marker is clicked or not
  //   const getIcon = (key) => {
  //     console.log('clicked marker is ', clickedMarker)
  //     console.log('key is ', key)
  //     return key == clickedMarker ? clickedIcon : parkingIcon
  //   }

  // Memoize the renderMarkers function to avoid unnecessary re-renders
  const renderMarkers = useMemo(() => {
    const bounds = new window.google.maps.LatLngBounds()
    if (markers.length === 0) {
      console.log('no markers')
      return null
    }
    // iterate through markers object and create a marker for each

    console.log('rendering markers')
    const markersWithBounds = Object.keys(markers).map((key) => {
      const marker = markers[key]
      const position = { lat: marker.lat, lng: marker.lng }
      //   console.log('position', position)
      bounds.extend(position)
      return (
        <Marker
          key={key}
          position={position}
          icon={parkingIcon}
          onClick={() => handleMarkerClick(key)}
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
    <div style={{ flex: '1' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: '1 1 auto' }}>
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
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
        </div>

        {clickedMarker && (
          <div className='streetview' style={{ flex: '1 1 25%' }}>
            <GoogleMap
              // add mapcontainerstyle to for 20% height starting from the bottom
              mapContainerStyle={streetViewStyle}
            >
              {/* onyl show streetview if theres a clicked marker */}

              {/* <StreetViewPanorama
                position={markers[clickedMarker]}
                visible={true}
                options={{
                  zoom: 1,
                  addressControl: false,
                  fullscreenControl: false,
                  motionTracking: false,
                  linksControl: false,
                  panControl: false,
                  enableCloseButton: false,
                  scrollwheel: false,
                  showRoadLabels: false,
                  bestGuess: true,
                  source: window.google.maps.StreetViewSource.OUTDOOR,
                }}
              /> */}
            </GoogleMap>
          </div>
        )}
      </div>
    </div>
  )
}

export default Map
