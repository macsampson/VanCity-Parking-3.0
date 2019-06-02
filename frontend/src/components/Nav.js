import { Navbar, Form, FormControl, Button } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
// import { search } from "./Map";

import React, { Component } from "react";

var autocomplete;

export default class Nav extends Component {
  state = {
    location: null,
    rate: 0,
    distance: 0,
    meter_type: "Any",
    query: {
      location: null,
      distance: 0
    }
  };

  componentDidUpdate() {
    this.initNav();
  }

  onDistanceChange = distance => {
    this.setState({
      distance
    });
    this.props.distance(distance);
  };

  onRateChange = rate => {
    this.setState({
      rate
    });
    this.props.rate(rate);
  };

  handleLocationChange = e => {
    this.setState({
      location: e.target.value
    });
  };

  handleSearch = () => {
    // search();
  };

  onTypeChange = e => {
    this.setState({
      meter_type: e.target.value
    });
    this.props.meter_type(e.target.value);
  };

  handleQuery = () => {
    this.setState(
      {
        query: {
          location: autocomplete.value,
          distance: this.state.distance
        }
      },
      this.props.query(this.state.query)
    );
  };

  initNav = () => {
    const { google } = this.props;
    const maps = google.maps;
    // Declare Options For Autocomplete
    var options = {
      types: []
    };
    // Set the search bar to use Googles Place Autocomplete library
    let inputNode = document.getElementById("autocomplete");
    autocomplete = new maps.places.Autocomplete(inputNode, options);
    // Set the autocomplate to bias towards locations within the maps current viewport
    autocomplete.bindTo("bounds", this.props.map);
  };

  render() {
    const style = {
      width: "100%"
    };
    const brandStyle = {
      margin: "0px 15px 0px 0px"
    };
    const sliderStyle = {
      width: "15rem",
      marginRight: "3rem"
    };
    const labelStyle = {
      minWidth: "60px",
      display: "inline-block",
      color: "#fff"
    };
    const typeStyle = {
      width: "auto",
      marginRight: "3rem"
    };
    const searchNavStyle = {
      padding: "0rem 0rem 1rem 16.5rem"
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
              onChange={this.handleLocationChange}
              style={style}
            />
          </Form>
          <Button onClick={this.handleSearch} variant="primary" type="submit">
            Search
          </Button>
        </Navbar>
        <Navbar style={searchNavStyle} bg="dark" variant="dark">
          <label style={labelStyle}>Meter Type:</label>
          <Form.Control
            style={typeStyle}
            as="select"
            onChange={this.onTypeChange}
          >
            <option>Any</option>
            <option>Single</option>
            <option>Twin</option>
            <option>Motorcycle</option>
            <option>Disability</option>
          </Form.Control>
          <div style={sliderStyle}>
            <label style={labelStyle}>
              Search Distance: {this.state.distance} meters
            </label>
            <Slider
              onChange={this.onDistanceChange}
              min={0}
              max={250}
              step={1}
            />
          </div>
          <div style={sliderStyle}>
            <label style={labelStyle}>
              Max Hourly Rate: ${this.state.rate}.00
            </label>
            <Slider onChange={this.onRateChange} min={0} max={10} step={1} />
          </div>
        </Navbar>
      </div>
    );
  }
}
