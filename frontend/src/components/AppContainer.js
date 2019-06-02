import React, { Component } from "react";
// import GoogleApiComponent from "./GoogleApiComponent";
import Map from "./Map";

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // rate: 0,
      // distance: 0,
      // meter_type: "Any",
      // map: null,
      // autoComp: null
    };
  }

  // setMap = map => {
  //   this.setState({ map: map });
  //   map = this.state.map;
  // };

  // setAutocomplete = autocomplete => {
  //   this.setState(
  //     {
  //       autoComp: autocomplete
  //     },
  //     () => {
  //       console.log(this.state.autoComp);
  //       this.search();
  //     }
  //   );
  // };

  // setRate = rate => {
  //   this.setState({ rate: rate });
  // };

  // setDistance = distance => {
  //   this.setState({ distance: distance });
  // };

  // setType = type => {
  //   this.setState({
  //     meter_type: type
  //   });
  // };

  // handleSearch = () => {
  //   this.search();
  // };

  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
}

export default AppContainer;
