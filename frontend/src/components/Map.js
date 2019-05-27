import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";

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
    return (
      <div>
        <SearchBar
          id="autocomplete"
          placeholder="Search..."
          value=""
          style={{
            margin: "0 auto",
            maxWidth: "100vw"
          }}
        />
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
      zoom: 13
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
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
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
      var url = new URL("http://localhost:3001/meters"),
        params = { lat: search_lat, lng: search_lng, distance: 100 };
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
      );

      getMeters(url).catch(err => console.log("Fetch Error : -S", err));
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
function addInfoWindow(marker, data) {
  // Attaching a click event to the current marker
  var infowindow = new window.google.maps.InfoWindow({
    content: data
  });
  marker.addListener("click", function() {
    infowindow.open(map, marker);
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

  addInfoWindow(marker, JSON.stringify(meter.properties));
  markers.push(marker);
}

export default Map;
