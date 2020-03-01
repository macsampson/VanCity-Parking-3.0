import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import InfoWindow from './InfoWindow'
import PropTypes from 'prop-types'
import toaster from 'toasted-notes'
import Nav from './Nav'

import '../App.css'

var map
var markers = []
var activeInfoWindow // Keeps track of the last active info window (used for closing when a new one is opened)
var autocomplete
var moment = require('moment')

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      rate: 'Any',
      distance: 100,
      meter_type: 'Any'
    }
  }

  componentDidMount() {
    window.initMap = this.initMap
  }

  handleDistanceChange = distance => {
    this.setState({
      distance
    })
  }

  handleRateChange = rate => {
    this.setState({
      rate
    })
  }

  handleTypeChange = type => {
    this.setState({
      meter_type: type
    })
  }

  handleSearch = e => {
    this.search()
  }

  initMap = () => {
    let { initialCenter, zoom } = this.props
    let { lat, lng } = initialCenter
    const center = new window.google.maps.LatLng(lat, lng)
    const node = document.getElementById('map')
    const mapConfig = Object.assign(
      {},
      {
        center: center,
        zoom: zoom,
        gestureHandling: 'greedy',
        fullscreenControl: false,
        zoomControl: false
      }
    )
    map = new window.google.maps.Map(node, mapConfig)

    // Close info window when the map is clicked
    window.google.maps.event.addListener(map, 'click', e => {
      activeInfoWindow.close()
    })

    // Declare Options For Autocomplete
    var options = {
      types: []
    }
    // Set the search bar to use Googles Place Autocomplete library
    let inputNode = document.getElementById('autocomplete')
    autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      options
    )

    autocomplete.addListener('place_changed', this.search)

    // Set the autocomplate to bias towards locations within the maps current viewport
    autocomplete.bindTo('bounds', map)

    // Prevent form from getting submitted when the enter key is pressed
    // window.google.maps.event.addDomListener(inputNode, "keydown", function(
    //   event
    // ) {
    //   if (event.keyCode === 13) {
    //     event.preventDefault();
    //   }
    // });
  }

  // Conduct search using parameters given from user
  search = () => {
    // Re-center and zoom the map to the location entered in the search box
    for (let marker of markers) {
      marker.setMap(null)
    }
    markers = []
    var place = autocomplete.getPlace()

    // Do nothing is there is no place
    if (!place) {
      return
    }
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'")
      return
    }

    // Construct url with query params to pass to the fetch function
    var search_lat = place.geometry.location.lat()
    var search_lng = place.geometry.location.lng()

    var searchLatlng = new window.google.maps.LatLng(search_lat, search_lng)
    let search_location = new window.google.maps.Marker({
      position: searchLatlng,
      map: map
    })
    markers.push(search_location)

    // Construct the api call
    const url = new URL(
      'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=parking-meters'
    )

    // const key = process.env.VAN_OPEN_KEY
    url.searchParams.append('rows', '100')

    url.searchParams.append(
      'geofilter.distance',
      search_lat + ',' + search_lng + ',' + this.state.distance
    )

    if (this.state.meter_type !== 'Any') {
      url.searchParams.append('refine.meterhead', this.state.meter_type)
    }

    console.log(url)
    getMeters(url, search_location).catch(err =>
      console.log('Fetch Error : -S', err)
    )
  }

  render() {
    return (
      <div>
        <Nav
          distance={this.handleDistanceChange}
          rate={this.handleRateChange}
          type={this.handleTypeChange}
          search={this.handleSearch}
        />
        <div id="map" />
      </div>
    )
  }
}

// Fetch meters from the given endpoint and add each one to the map
async function getMeters(url, search_loc) {
  let response = await fetch(url)
  let json = await response.json()
  let meters = json.records
  console.log(meters)
  // If no meters are returned, show an alert and return
  if (meters === []) {
    toaster.notify(
      'No meters found with specified filters. Please adjust filters and try searching again.',
      {
        duration: 3000
      }
    )
    return
  }

  var icons = {
    parking: {
      icon: '/images/parking-meter.png'
    },
    ev: {
      icon: '/images/ev-station.png'
    }
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
    map: map
  })

  addInfoWindow(marker, meter)
  markers.push(marker)
}

// Function to add info window to a marker
function addInfoWindow(marker, json) {
  let raw_date = new Date(json.record_timestamp)
  let updated_date = moment(raw_date).format('MMMM Do, YYYY')

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
  marker.addListener('click', function() {
    if (activeInfoWindow) {
      activeInfoWindow.close()
    }
    infowindow.open(map, marker)
    activeInfoWindow = infowindow
  })
}

// Function to attach a click event to the current marker
function bindInfoWindow(marker, mapOrStreetViewObject, infoWindowObject, html) {
  window.google.maps.event.addListener(marker, 'click', function() {
    infoWindowObject.setContent(html)
    infoWindowObject.open(mapOrStreetViewObject, marker)
  })
}

Container.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.object,
  gestureHandling: PropTypes.string,
  fullscreenControl: PropTypes.bool
}

Container.defaultProps = {
  zoom: 13,
  // Vancouver, by default
  initialCenter: {
    lat: 49.24966,
    lng: -123.11934
  }
}

export default Container
