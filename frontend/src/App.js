import React, { Component } from "react";
import GoogleMap from "google-map-react";

const dotenv = require("dotenv");
dotenv.config();

const key = process.env.REACT_APP_MAPS_API;

const mapStyles = {
  width: "100%",
  height: "100%"
};

const markerStyle = {
  height: "50px",
  width: "50px",
  marginTop: "-50px"
};

const imgStyle = {
  height: "100%"
};

const Marker = ({ title }) => (
  <div style={markerStyle}>
    <img
      style={imgStyle}
      src="https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png"
      alt={title}
    />
    <h3>{title}</h3>
  </div>
);

class App extends Component {
  state = { meters: [] };
  componentDidMount() {
    fetch("/meters")
      .then(res => res.json())
      .then(meters => this.setState({ meters }));
  }

  // render() {
  //   return (
  //     <div className="App">
  //       <h1>Meters</h1>
  //       {this.state.meters.map(meter => (
  //         <div key={meter.properties.meter_id}>
  //           {meter.properties.meter_type}
  //           {meter.properties.credit_card}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }
  render() {
    return (
      <div>
        <GoogleMap
          style={mapStyles}
          bootstrapURLKeys={{ key: key }}
          center={{ lat: 49.246292, lng: -123.116226 }}
          zoom={14}
        >
          <Marker
            title={"Current Location"}
            lat={49.246292}
            lng={-123.116226}
          />
        </GoogleMap>
      </div>
    );
  }
}

export default App;
