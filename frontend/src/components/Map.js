import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import InfoWindow from "./InfoWindow";
import { Navbar, Form, FormControl, Button } from "react-bootstrap";
import Slider, { Range } from "rc-slider";

import "rc-slider/assets/index.css";

var map;
var markers = [];
var activeInfoWindow; // Keeps track of the last active info window (used for closing when a new one is opened)
var autocomplete;

class Map extends Component {
  constructor() {
    super();
    this.state = {
      meters: [],
      rates: [],
      distance: 0
    };
  }

  onSliderChange = distance => {
    // console.log(distance);
    this.setState({
      distance
    });
  };
  // onAfterChange = distance => {
  //   console.log(distance); //eslint-disable-line
  // };

  componentDidMount() {
    //TODO: get unique rates to populate dropdown
    this.renderMap();
  }

  // Conduct search using parameters given from user
  search = () => {
    // Re-center and zoom the map to the location entered in the search box
    for (let marker of markers) {
      marker.setMap(null);
    }
    markers = [];
    var place = autocomplete.getPlace();
    // Do nothing is there is no place
    if (!place) {
      return;
    }
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks on point
    }

    // Construct url with query params to pass to the fetch function
    var search_lat = place.geometry.location.lat();
    var search_lng = place.geometry.location.lng();

    // TODO: Change the domain and port before deploying to prod
    // TODO: Grab distance value from input
    var url = new URL("http://localhost:3001/meters"),
      params = {
        lat: search_lat,
        lng: search_lng,
        distance: this.state.distance
      };
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );
    getMeters(url).catch(err => console.log("Fetch Error : -S", err));
  };

  renderMap() {
    window.initMap = this.initMap;
  }

  initMap() {
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 49.24966, lng: -123.11934 },
      zoom: 13,
      gestureHandling: "greedy",
      fullscreenControl: false
    });
    // Declare Options For Autocomplete
    var options = {
      types: []
    };
    // Set the search bar to use Googles Place Autocomplete library
    let inputNode = document.getElementById("autocomplete");
    autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      options
    );
    // Allows user to press enter to select the places autocomplete option and perform search
    window.google.maps.event.addDomListener(inputNode, "keydown", function(
      event
    ) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });
    // Set the autocomplate to bias towards locations within the maps current viewport
    autocomplete.bindTo("bounds", map);
  }

  render() {
    const style = {
      width: "100%"
    };
    const brandStyle = {
      margin: "0px 15px 0px 0px"
    };
    const sliderStyle = {
      width: "25%"
    };
    const labelStyle = {
      minWidth: "60px",
      display: "inline-block",
      color: "#fff"
    };
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/parking-favicon-96.png"
              width="42"
              height="42"
              className="d-inline-block align-top"
              style={brandStyle}
            />
            Parking Spot Finder
          </Navbar.Brand>
          <Form inline style={style}>
            <FormControl
              id="autocomplete"
              type="text"
              placeholder="Search..."
              className="mr-sm-2"
              style={style}
            />
          </Form>
          <Button onClick={this.search} variant="primary" type="submit">
            Search
          </Button>
        </Navbar>
        <Navbar bg="dark" variant="dark">
          <div style={sliderStyle}>
            <label style={labelStyle}>
              Search Distance: {this.state.distance} meters
            </label>
            <Slider onChange={this.onSliderChange} min={0} max={250} step={1} />
          </div>
        </Navbar>
        <div id="map" />
      </div>
    );
  }
}

// Fetch unique rates from a given endpoint and save them to the state
function getRates(url) {
  fetch("http://localhost:3001/rates")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let rates = data.map(rate => {
        return { value: rate, display: rate };
      });
      this.setState({
        rates: [{ value: "", display: "Select Rate" }].concat(rates)
      });
    })
    .catch(error => {
      console.log(error);
    });
}

// Fetch meters from the given endpoint and add each one to the map
async function getMeters(url) {
  let response = await fetch(url);
  let meters = await response.json();

  for (let meter of meters) {
    addMarker(meter, map);
  }

  // // Fit the map to the coordinates of all the markers
  // var bounds = new window.google.maps.LatLngBounds();
  // for (let marker of markers) {
  //   bounds.extend(marker.getPosition());
  // }
  // map.fitBounds(bounds);
}

// Function to add info window to a marker
function addInfoWindow(marker, json) {
  let contentString = ReactDOMServer.renderToString(
    <InfoWindow
      key={json.meter_id}
      weekdays={json.limits_and_rates.weekdays}
      saturdays={json.limits_and_rates.saturday}
      sundays={json.limits_and_rates.sunday}
      meter_type={json.meter_type}
      pay_by_phone={json.pay_by_phone_num}
      credit_card={json.credit_card}
      extras={json.prohibitions}
    />
  );

  // Attaching a click event to the current marker
  var infowindow = new window.google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener("click", function() {
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    infowindow.open(map, marker);
    activeInfoWindow = infowindow;
  });
}

// Function to add markers to the map
function addMarker(meter, map) {
  var latLng = new window.google.maps.LatLng(
    meter.geometry.coordinates[1],
    meter.geometry.coordinates[0]
  );

  var marker = new window.google.maps.Marker({
    position: latLng,
    map: map
  });

  addInfoWindow(marker, meter.properties);
  markers.push(marker);
}

export default Map;
