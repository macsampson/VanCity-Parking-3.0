import React, { Component } from 'react'
import '../App.css'

class InfoWindow extends Component {
  render() {
    return (
      <table className="infoWindow">
        <div>
          <tr>
            <td rowSpan="13" id="time-image-col">
              <img alt="time" src="/images/baseline-access_time-24px.svg" />
            </td>
            <th rowSpan="4">
              <b>Mon-Fri:</b>
            </th>
            <td>9am - 6pm</td>
            <td>{this.props.weekdays_early_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.weekdays_early_limit}</td>
          </tr>
          <tr>
            <td>6pm - 10pm</td>
            <td>{this.props.weekdays_late_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.weekdays_late_limit}</td>
          </tr>
          <tr>
            <th rowSpan="4">
              <b>Saturday:</b>
            </th>
            <td>9am - 6pm</td>
            <td>{this.props.saturdays_early_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.saturdays_early_limit}</td>
          </tr>
          <tr>
            <td>6pm - 10pm</td>
            <td>{this.props.saturdays_late_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.saturdays_late_limit}</td>
          </tr>
          <tr>
            <th rowSpan="4">
              <b>Sunday:</b>
            </th>
            <td>9am - 6pm</td>
            <td>{this.props.sunday_early_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.sunday_early_limit}</td>
          </tr>
          <tr>
            <td>6pm - 10pm</td>
            <td>{this.props.sunday_late_rate}/hr</td>
          </tr>
          <tr>
            <td className="limit">Limit: {this.props.sunday_late_limit}</td>
          </tr>
          <tr>
            <th>
              <b>In Effect:</b>
            </th>
            <td>{this.props.in_effect}</td>
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
            <td>
              <img alt="meter" src="/images/baseline-local_parking-24px.svg" />
            </td>
            <th>
              <b>Meter Type: </b>
            </th>
            <td>{this.props.meter_type}</td>
          </tr>
          <tr>
            <td>
              <img alt="info" src="/images/round-info-24px.svg" />
            </td>
            <th>
              <b>Meter Info Last Updated: </b>
            </th>
            <td>{this.props.updated}</td>
          </tr>
        </div>
      </table>
    )
  }
}

export default InfoWindow
