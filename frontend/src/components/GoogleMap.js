import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";

// import ReactDOM from "react-dom";

class GoogleMap extends Component {
  componentDidMount() {
    this.renderMap();
  }

  geocodeAddress() {
    var geocoder = new window.google.maps.Geocoder();
    var address = document.getElementById("autocomplete");
    geocoder.geocode({ address: address }, function(results, status) {
      if (status === "OK") {
        console.log(results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
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
          onRequestSearch={() => {
            this.geocodeAddress();
          }}
        />
        <div id="map" />
      </div>
    );
  }

  renderMap = () => {
    window.initMap = this.initMap;
  };

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 49.24966, lng: -123.11934 },
      zoom: 13
    });

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
    });
  };
}

export default GoogleMap;
