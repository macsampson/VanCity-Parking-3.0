import React, { Component } from "react";
import "../App.css";

class InfoWindow extends Component {
  render() {
    return (
      <table className="infoWindow">
        <div>
          <tr>
            <td rowSpan="12">
              <img alt="time" src="/images/baseline-access_time-24px.svg" />
            </td>
            <th rowSpan="4">
              <b>Mon-Fri:</b>
            </th>
            <td>
              {this.props.weekdays[0].start} - {this.props.weekdays[0].end}
            </td>
            <td>{this.props.weekdays[0].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.weekdays[0].hour_limit} hours
            </td>
          </tr>
          <tr>
            <td>
              {this.props.weekdays[1].start} - {this.props.weekdays[1].end}
            </td>
            <td>{this.props.weekdays[1].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.weekdays[1].hour_limit} hours
            </td>
          </tr>

          <tr>
            <th rowSpan="4">
              <b>Saturday:</b>
            </th>
            <td>
              {this.props.saturdays[0].start} - {this.props.saturdays[0].end}
            </td>
            <td>{this.props.saturdays[0].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.saturdays[0].hour_limit} hours
            </td>
          </tr>
          <tr>
            <td>
              {this.props.saturdays[1].start} - {this.props.saturdays[1].end}
            </td>
            <td>{this.props.saturdays[1].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.saturdays[1].hour_limit} hours
            </td>
          </tr>

          <tr>
            <th rowSpan="4">
              <b>Sunday:</b>
            </th>
            <td>
              {this.props.sundays[0].start} - {this.props.sundays[0].end}
            </td>
            <td>{this.props.sundays[0].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.sundays[0].hour_limit} hours
            </td>
          </tr>
          <tr>
            <td>
              {this.props.sundays[1].start} - {this.props.sundays[1].end}
            </td>
            <td>{this.props.sundays[1].rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">
              Limit: {this.props.sundays[1].hour_limit} hours
            </td>
          </tr>

          <tr>
            <td>
              <img alt="phone" src="/images/baseline-speaker_phone-24px.svg" />
            </td>
            <th>
              <b>Pay By Phone #:</b>
            </th>
            <td>{this.props.pay_by_phone}</td>
          </tr>

          <tr>
            <td>
              <img alt="credit" src="/images/baseline-credit_card-24px.svg" />
            </td>
            <th>
              <b>Credit Card Accepted:</b>
            </th>
            <td>{this.props.credit_card}</td>
          </tr>

          <tr>
            <td rowSpan="2">
              <img alt="info" src="/images/round-info-24px.svg" />
            </td>
            <th>
              <b>Meter Type: </b>
            </th>
            <td>{this.props.meter_type}</td>
          </tr>
          <th>
            <b>Additional Info: </b>
          </th>
          <td>{this.props.extras}</td>
        </div>
      </table>
    );
  }
}

export default InfoWindow;
