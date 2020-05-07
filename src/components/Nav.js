import { Navbar, Form, FormControl, Button } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { Component } from "react";
// import Switch from "react-switch";

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: "Any",
      dollarRate: "Any",
      distance: 100,
      meter_type: "Any",
      crime: false,
      navExpanded: false,
    };
  }

  onDistanceChange = (distance) => {
    this.setState({
      distance,
    });
    this.props.distance(distance);
  };

  onRateChange = (rate) => {
    var dollars;
    if (rate === 10) {
      dollars = "Any";
      rate = "Any";
    } else {
      dollars = "$" + rate + ".00";
    }

    this.setState({
      dollarRate: dollars,
      rate: rate,
    });
    this.props.rate(rate);
  };

  onTypeChange = (e) => {
    this.setState({
      meter_type: e.target.value,
    });
    this.props.type(e.target.value);
  };

  onSearch = (e) => {
    this.props.search(e);
    this.closeNav();
  };

  handleChange = (crime) => {
    this.setState({ crime });
  };

  setNavExpanded = (expanded) => {
    this.setState({ navExpanded: expanded });
  };

  closeNav = () => {
    this.setState({ navExpanded: false });
  };

  render() {
    // const searchStyle = {
    //   flex: "5",
    //   display: "flex"
    // };
    // const brandStyle = {
    //   margin: "0px 15px 0px 0px",
    //   flex: "1"
    // };
    const sliderStyle = {
      flex: "1",
      padding: "1rem 1rem",
      whiteSpace: "nowrap",
    };
    const labelStyle = {
      // minWidth: "60px",
      display: "inline-block",
      color: "#fff",
      padding: "0rem 0.5rem",
    };
    const typeLabelStyle = {
      // minWidth: "60px",
      display: "inline-block",
      color: "#fff",
      padding: "1rem 1.5rem 1rem 0rem",
    };
    const typeStyle = {
      flex: "1",
      padding: "0rem 1rem",
      flexFlow: "row",
      whiteSpace: "nowrap",
    };
    const navStyle = {
      display: "flex",
    };
    const boxStyle = {
      width: "85%",
      flex: "10",
    };
    const buttonStyle = {
      margin: "0rem 0.5rem",
      flex: "1",
    };
    return (
      <div>
        <Navbar
          onToggle={this.setNavExpanded}
          expanded={this.state.navExpanded}
          expand="xl"
          style={navStyle}
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand>
            <img
              alt="parking logo"
              src="/parking-favicon-96.png"
              width="42"
              height="42"
              className="d-inline-block align-top"
              id="brand-logo"
            />
            <div id="brand-text">{"VanCity Parking"}</div>
          </Navbar.Brand>
          <FormControl
            id="autocomplete"
            type="search"
            placeholder="Search..."
            style={boxStyle}
          />
          {/* <Button
            onClick={this.onSearch}
            variant="primary"
            type="submit"
            style={buttonStyle}
            id="search-button-web"
          >
            Search
          </Button> */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Form inline style={typeStyle}>
              <label style={typeLabelStyle}>Meter Type:</label>
              <FormControl as="select" onChange={this.onTypeChange}>
                <option>Any</option>
                <option>Single</option>
                <option>Twin / Disability</option>
                <option>Motorbike</option>
                <option>Pay Station</option>
                <option>Bay</option>
              </FormControl>
            </Form>
            <div style={sliderStyle}>
              <label style={labelStyle}>
                Search Distance: {this.state.distance} meters
              </label>
              <Slider
                onChange={this.onDistanceChange}
                defaultValue={100}
                min={0}
                max={250}
                step={5}
              />
            </div>
            {/* <div style={sliderStyle}>
              <label style={labelStyle}>
                Max Hourly Rate: {this.state.dollarRate}
              </label>
              <Slider
                onChange={this.onRateChange}
                defaultValue={10}
                min={1}
                max={10}
                step={1}
              />
            </div> */}
            <Button
              onClick={this.onSearch}
              variant="primary"
              type="submit"
              style={buttonStyle}
              id="search-button-web"
            >
              Filter
            </Button>
            <Button
              onClick={this.onSearch}
              variant="primary"
              type="submit"
              style={buttonStyle}
              id="search-button-mobile"
            >
              Filter
            </Button>
          </Navbar.Collapse>
          {/* <label style={labelStyle}>
            <span>Vehicle Theft Overlay</span>
            <Switch
              onChange={this.handleChange}
              checked={this.state.crime}
              onColor={"#007bff"}
            />
          </label> */}
        </Navbar>
      </div>
    );
  }
}
