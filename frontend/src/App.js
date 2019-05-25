import React, { Component } from "react";
import "./App.css";
import GoogleMap from "./components/GoogleMap";

const dotenv = require("dotenv");
dotenv.config();

const key = process.env.REACT_APP_MAPS_API;

class App extends Component {
  state = { meters: [] };

  // Load Google API when the app component is mounted
  componentDidMount() {
    this.loadScript(
      "https://maps.googleapis.com/maps/api/js?key=" +
        key +
        "&callback=initMap&libraries=places"
    );
    // fetch("/meters")
    //   .then(res => res.json())
    //   .then(meters => this.setState({ meters }));
  }

  loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
  }

  render() {
    return (
      <main>
        <GoogleMap />
      </main>
    );
  }
}

//

export default App;
