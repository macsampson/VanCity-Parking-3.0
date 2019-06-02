import React, { Component } from "react";
import GoogleApiComponent from "./GoogleApiComponent";
import Nav from "./Nav";
import Map from "./Map";

class AppContainer extends Component {
  state = { query: null, rate: 0, distance: 0, meter_type: "Any", map: null };

  addMap = map => {
    this.setState({ map: map });
  };

  setRate = rate => {
    this.setState({ rate: rate });
  };

  setDistance = distance => {
    this.setState({ distance: distance });
  };

  setType = type => {
    this.setState({
      meter_type: type
    });
  };

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Nav
          rate={this.setRate}
          distance={this.setDistance}
          query={this.search}
          google={this.props.google}
          map={this.state.map}
          meter_type={this.setType}
        />
        <Map google={this.props.google} map={this.addMap} />
      </div>
    );
  }
}

export default GoogleApiComponent({
  apiKey: process.env.REACT_APP_MAPS_API
})(AppContainer);
