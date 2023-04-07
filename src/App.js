import React, { useEffect } from 'react'
// import './App.css';
import Container from './components/Container'
import MapContainer from './components/MapContainer'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <main>
      <Sidebar></Sidebar>
      <MapContainer />
    </main>
  )
}
