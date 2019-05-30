import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import InfoWindow from "./InfoWindow";
import { Navbar, Form, FormControl } from "react-bootstrap";

var map;
var markers = [];

class Map extends Component {
  constructor() {
    super();
    this.state = {
      map: null,
      meters: []
    };
  }

  componentDidMount() {
    this.renderMap();
  }

  render() {
    var style = {
      width: "100%"
    };
    var brandStyle = {
      margin: "0px 15px 0px 0px"
    };
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/parking-favicon-96.png"
              width="30"
              height="30"
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
        </Navbar>
        <div id="map" />
      </div>
    );
  }

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

    // this.setState({ map: map });

    // Declare Options For Autocomplete
    var options = {
      types: []
    };

    // Set the search bar to use Googles Place Autocomplete library
    let inputNode = document.getElementById("autocomplete");
    let autocomplete = new window.google.maps.places.Autocomplete(
      inputNode,
      options
    );

    // Set the autocomplate to bias towards locations within the maps current viewport
    autocomplete.bindTo("bounds", map);

    // Re-center and zoom the map to the location entered in the search box
    autocomplete.addListener("place_changed", function() {
      for (let marker of markers) {
        marker.setMap(null);
      }
      markers = [];
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
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
      var url = new URL("http://localhost:3001/meters"),
        params = { lat: search_lat, lng: search_lng, distance: 100 };
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
      );

      getMeters(url).catch(err => console.log("Fetch Error : -S", err));

      // TODO: Adjust map bounds to better fit all markers
      // var bounds = new window.google.maps.LatLngBounds();
      // for (let marker of markers) {
      //   bounds.extend(marker.getPosition());
      // }

      // map.fitBounds(bounds);
    });
  }
}

// Fetch meters using given url and add each one to the map
async function getMeters(url) {
  let response = await fetch(url);
  let meters = await response.json();

  for (let meter of meters) {
    addMarker(meter, map);
  }
}

// Function to add info window to a marker
function addInfoWindow(marker, json) {
  // Parse out relevant info from json data
  // TODO:
  // let weekdays = json.limit_and_rates.weekdays;
  // let weekday_limits = [];
  // let weekday_rates = [];
  // let saturdays = json.limit_and_rates.saturday;
  // let sat_limits = [];
  // let sat_rates = [];
  // let sundays = json.limit_and_rates.sunday;
  // let sun_limits = [];
  // let sun_rates = [];
  // let meter_type = json.meter_type;
  // let credit_card = json.credit_card;
  // let pay_by_phone = json.pay_by_phone;
  // let meter_id = json.meter_id;
  // let in_effect = json.in_effect;

  // for (let slot of weekdays) {
  //   weekday_limits.push.apply(weekday_limits, [
  //     slot.start,
  //     slot.end,
  //     slot.rate
  //   ]);
  // }
  // console.log(weekday_limits);

  let contentString = ReactDOMServer.renderToString(
    <InfoWindow
      key={json.meter_id}
      weekdays={json.limits_and_rates.weekdays}
      saturdays={json.limits_and_rates.saturday}
      sundays={json.limits_and_rates.sunday}
      meter_type={json.meter_type}
      pay_by_phone={json.pay_by_phone}
      credit_card={json.credit_card}
    />
  );

  // Attaching a click event to the current marker
  var activeInfoWindow;
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
