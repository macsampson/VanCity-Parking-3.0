import React, { useState, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'
import InfoWindow from './InfoWindow'
import PropTypes from 'prop-types'
import Nav from './Nav'

import '../App.css'

let map
let markers = []
let activeInfoWindow
let autocomplete

let styles = {
  default: [],
  hide: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

export default function Container({ initialCenter, zoom }) {
  const [location, setLocation] = useState(null)
  const [rate, setRate] = useState('Any')
  const [distance, setDistance] = useState(100)
  const [meterType, setMeterType] = useState('Any')

  useEffect(() => {
    window.initMap = initMap
  }, [])

  const handleDistanceChange = (distance) => {
    setDistance(distance)
  }

  const handleRateChange = (rate) => {
    setRate(rate)
  }

  const handleTypeChange = (type) => {
    setMeterType(type)
  }

  const handleSearch = (e) => {
    search(e)
  }

  //   const notify = (location) =>
  //     toast.error('No details available for ' + location)

  function initMap() {
    const { lat, lng } = initialCenter
    const center = new window.google.maps.LatLng(lat, lng)
    const node = document.getElementById('map')
    const mapConfig = Object.assign(
      {},
      {
        center: center,
        zoom: zoom,
        gestureHandling: 'greedy',
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: false,
      }
    )
    map = new window.google.maps.Map(node, mapConfig)

    map.setOptions({ styles: styles['hide'] })

    window.google.maps.event.addListener(map, 'click', (e) => {
      if (activeInfoWindow) {
        activeInfoWindow.close()
      }
    })

    var options = {
      types: [],
    }
    let inputNode = document.getElementById('autocomplete')
    autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      options
    )

    autocomplete.addListener('place_changed', search)

    autocomplete.bindTo('bounds', map)
  }

  const search = () => {
    for (let marker of markers) {
      marker.setMap(null)
    }
    markers = []
    var place = autocomplete.getPlace()

    if (!place) {
      return
    }
    if (!place.geometry) {
      //   notify(place.name)
      return
    }

    var search_lat = place.geometry.location.lat()
    var search_lng = place.geometry.location.lng()

    var searchLatlng = new window.google.maps.LatLng(search_lat, search_lng)
    let search_location = new window.google.maps.Marker({
      position: searchLatlng,
      map: map,
    })
    markers.push(search_location)

    const url = new URL(
      'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=parking-meters'
    )

    url.searchParams.append('rows', '100')

    url.searchParams.append(
      'geofilter.distance',
      search_lat + ',' + search_lng + ',' + distance
    )

    if (meterType !== 'Any') {
      url.searchParams.append('refine.meterhead', meterType)
    }

    getMeters(url, search_location).catch((err) =>
      console.log('Fetch Error : -S', err)
    )
  }

  return (
    <div className="map-container">
      <Nav
        distance={handleDistanceChange}
        rate={handleRateChange}
        type={handleTypeChange}
        search={handleSearch}
      />
      <div id="map" />
    </div>
  )
}

// Fetch meters from the given endpoint and add each one to the map
async function getMeters(url, search_loc) {
  let response = await fetch(url)
  let json = await response.json()
  let meters = json.records
  console.log(meters)
  // If no meters are returned, show an alert and return
  if (meters.length === 0) {
    console.log('No meters')
    // TODO make toast
    return
  }

  var icons = {
    parking: {
      icon: '/images/parking-meter.png',
    },
    ev: {
      icon: '/images/ev-station.png',
    },
  }

  // Else begin adding markers to the map
  for (let meter of meters) {
    addMarker(meter, map, icons.parking.icon)
  }

  // Fit the map to the coordinates of all the markers
  var bounds = new window.google.maps.LatLngBounds()
  for (let marker of markers) {
    bounds.extend(marker.getPosition())
  }
  map.fitBounds(bounds)
}

// Function to add markers to the map
function addMarker(meter, map, icon) {
  var latLng = new window.google.maps.LatLng(
    meter.fields.geom.coordinates[1],
    meter.fields.geom.coordinates[0]
  )

  var marker = new window.google.maps.Marker({
    position: latLng,
    icon: icon,
    map: map,
  })

  addInfoWindow(marker, meter)
  markers.push(marker)
}

// Function to add info window to a marker
const addInfoWindow = (marker, json) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  let raw_date = new Date(json.record_timestamp)
  let updated_date = raw_date.toLocaleDateString('en-US', options)

  let in_effect = json.fields.timeineffe.replace('METER IN EFFECT:', '')
  let contentString = ReactDOMServer.renderToString(
    <InfoWindow
      key={json.fields.meterid}
      meter_type={json.fields.meterhead}
      in_effect={in_effect}
      weekdays_early_rate={json.fields.r_mf_9a_6p}
      weekdays_early_limit={json.fields.t_mf_9a_6p}
      weekdays_late_rate={json.fields.r_mf_6p_10}
      weekdays_late_limit={json.fields.t_mf_6p_10}
      saturdays_early_rate={json.fields.r_sa_9a_6p}
      saturdays_early_limit={json.fields.t_sa_9a_6p}
      saturdays_late_rate={json.fields.r_sa_6p_10}
      saturdays_late_limit={json.fields.t_sa_6p_10}
      sunday_early_rate={json.fields.r_su_9a_6p}
      sunday_early_limit={json.fields.t_su_9a_6p}
      sunday_late_rate={json.fields.r_su_6p_10}
      sunday_late_limit={json.fields.t_su_6p_10}
      pay_by_phone={json.fields.pay_phone}
      credit_card={json.fields.creditcard}
      updated={updated_date}
    />
  )

  var infowindow = new window.google.maps.InfoWindow({})

  var street = map.getStreetView()

  bindInfoWindow(marker, map, infowindow, contentString)
  bindInfoWindow(marker, street, infowindow, contentString)

  // Close active infowindow if another one is clicked
  marker.addListener('click', function () {
    if (activeInfoWindow) {
      activeInfoWindow.close()
    }
    infowindow.open(map, marker)
    activeInfoWindow = infowindow
  })
}

// Function to attach a click event to the current marker
const bindInfoWindow = (
  marker,
  mapOrStreetViewObject,
  infoWindowObject,
  html
) => {
  window.google.maps.event.addListener(marker, 'click', function () {
    infoWindowObject.setContent(html)
    infoWindowObject.open(mapOrStreetViewObject, marker)
  })
}

Container.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.object,
  gestureHandling: PropTypes.string,
  fullscreenControl: PropTypes.bool,
}

Container.defaultProps = {
  zoom: 13,
  // Vancouver, by default
  initialCenter: {
    lat: 49.24966,
    lng: -123.11934,
  },
}
