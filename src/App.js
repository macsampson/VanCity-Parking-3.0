import React, { Component } from 'react'
import './App.css'
import Container from './components/Container'

const dotenv = require('dotenv')
dotenv.config()

var key = process.env.REACT_APP_MAPS_API

class App extends Component {
  state = { map: null, meters: [], rate: 0, distance: 0 }

  // Load Google API when the app component is mounted
  componentDidMount() {
    this.loadScript(
      'https://maps.googleapis.com/maps/api/js?key=' +
        key +
        '&callback=initMap&libraries=places'
    )
  }

  loadScript(url) {
    var index = window.document.getElementsByTagName('script')[0]
    var script = window.document.createElement('script')
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
  }

  render() {
    return (
      <main>
        <Container />
      </main>
    )
  }
}

export default App
