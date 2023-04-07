import React, { useEffect } from 'react'
// import './App.css';
import Container from './components/Container'

const dotenv = require('dotenv')
dotenv.config()

const key = process.env.REACT_APP_MAPS_API

export default function App() {
  useEffect(() => {
    const loadScript = (url) => {
      const index = window.document.getElementsByTagName('script')[0]
      const script = window.document.createElement('script')
      script.src = url
      script.async = true
      script.defer = true
      index.parentNode.insertBefore(script, index)
    }

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=places`
    )
  }, [])

  return (
    <main>
      <Container />
    </main>
  )
}
