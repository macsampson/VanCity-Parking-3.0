import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import MeterInfo from './MeterInfo'
import fetchParkingMeters from '../utils/FetchParkingMeters'
import getDirections from '../utils/GetDirections'
import { Button, ButtonGroup } from '@mui/material'
import '../styles/Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpWideShort,
  faArrowDownShortWide,
} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar(props) {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [markers, setMarkers] = useState({})
  const [rawMeterInfo, setRawMeterInfo] = useState([])
  const [currentMeterId, setCurrentMeterId] = useState(null)
  const [currentMeters, setCurrentMeters] = useState([])
  const [currentMeterComps, setCurrentMeterComps] = useState([])
  const [sortOrder, setSortOrder] = useState({
    rate: 'asc',
    distance: 'asc',
  })
  const [prevView, setPrevView] = useState(null)

  const meterInfoRef = useRef(null) // reference to meter info card to scroll to

  // function to handle meter click
  const handleMeterClick = (meter) => {
    console.log('meter clicked', meter)
    setPrevView('list')
    props.clickedMeter(meter[0])
    setCurrentMeterId(meter[0])
  }

  const handleMeterClose = () => {
    setCurrentMeterId(null)
    props.clickedMeter(null)
    props.onClosed(prevView)
  }

  // function to handle sorting of meters
  const handleSort = (sortType) => {
    const sortedCurrentMeters = [...currentMeters]
    if (sortType === 'distance') {
      sortedCurrentMeters.sort((a, b) => {
        // if sortOrder is 'asc', return a.duration - b.duration
        // if sortOrder is 'desc', return b.duration - a.duration
        return (
          (sortOrder[sortType] === 'asc' ? 1 : -1) * (a.duration - b.duration)
        )
      })
    } else if (sortType === 'rate') {
      sortedCurrentMeters.sort((a, b) => {
        // if sortOrder is 'asc', return a.current_rate - b.current_rate
        // if sortOrder is 'desc', return b.current_rate - a.current_rate
        return (
          (sortOrder[sortType] === 'asc' ? 1 : -1) *
          (a.current_rate - b.current_rate)
        )
      })
    }
    setCurrentMeterId(null)
    props.clickedMeter(null)
    setCurrentMeters(sortedCurrentMeters)
    // get reference to the sidebar and scroll to top
    const sidebar = document.getElementById('meter-container')
    sidebar.scrollTop = 0

    setSortOrder((prev) => ({
      ...prev,
      [sortType]: prev[sortType] === 'asc' ? 'desc' : 'asc',
    }))
  }

  // call findmeterinfo when marker is clicked
  useEffect(() => {
    if (props.clickedMarker) {
      setCurrentMeterId(props.clickedMarker)
      setPrevView('map')
      // props.clickedMeter(props.clickedMarker)
    }
  }, [props.clickedMarker])

  // function to render meter info
  useEffect(() => {
    // console.log('rendering meter info', currentMeterId)
    if (currentMeters) {
      const newCurrentMeterComps = currentMeters.map((meter) => {
        return (
          <MeterInfo
            key={meter.meter_id}
            meter={meter}
            expanded={meter.meter_id[0] === currentMeterId}
            meterClicked={handleMeterClick}
          />
        )
      })
      setCurrentMeterComps(newCurrentMeterComps)
    }
  }, [currentMeters, currentMeterId])

  useEffect(() => {
    if (rawMeterInfo) {
      // console.log(rawMeterInfo)
      const newMeters = []
      for (const key in rawMeterInfo) {
        const meter = rawMeterInfo[key]
        newMeters.push(meter)
      }
      setCurrentMeters(newMeters)
    }
  }, [rawMeterInfo])

  // use effect to set selected place from props
  useEffect(() => {
    setSelectedPlace(props.selectedPlace)
  }, [props.selectedPlace])

  useEffect(() => {
    if (markers) {
      //   console.log('markers leaving sidebar', markers)
      props.onMarkersChange(markers)
    }
  }, [markers])

  // call the fetchParkingMeters function when place prop changes
  useEffect(() => {
    // console.log('selected place changed', selectedPlace)
    if (selectedPlace) {
      const fetchMeterInfo = async () => {
        setRawMeterInfo(null)
        try {
          const meterData = await fetchParkingMeters(selectedPlace)
          // console.log(data[0])
          const durations = await getDirections(meterData, selectedPlace)

          // iterate through meter data and add duration to each meter
          const dataWithDirections = {}
          for (const key in meterData) {
            const meter = meterData[key]
            meter.duration =
              durations[meter.location.lng + ',' + meter.location.lat].duration
            dataWithDirections[meter.location.lng + ',' + meter.location.lat] =
              meter
          }

          //   console.log(rawMeterInfo.data)
          const newMarkers = {}
          for (const key in dataWithDirections) {
            const meter = dataWithDirections[key]
            newMarkers[meter.meter_id] = {
              lng: meter.location.lng,
              lat: meter.location.lat,
            }
          }
          setRawMeterInfo(dataWithDirections)
          setMarkers(newMarkers)
        } catch (error) {
          console.error(error)
        }
      }
      fetchMeterInfo()
    }
  }, [selectedPlace])

  // useffect to update currentmeters when rawmeterinfo changes
  useEffect(() => {
    // console.log(rawMeterInfo);
    if (currentMeterId) {
      meterInfoRef.current = document.getElementById(currentMeterId)
      setTimeout(() => {
        meterInfoRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [currentMeterId])

  return (
    <div className={props.className}>
      {currentMeterId ? (
        <MeterInfo
          key={currentMeterId}
          meter={currentMeters.find(
            (meter) => meter.meter_id[0] === currentMeterId
          )}
          expanded={true}
          // meterClicked={handleMeterClick}
          onClosed={handleMeterClose}
        />
      ) : (
        <div>
          <div className='sorting-container'>
            <p className='sort-text'>Sort by:</p>
            <div className='sort-buttons'>
              <ButtonGroup
                variant='contained'
                aria-label='contained primary button group'
                style={{
                  width: '300px',
                }}
              >
                <Button
                  onClick={() => handleSort('rate')}
                  endIcon={
                    sortOrder.rate === 'asc' ? (
                      <FontAwesomeIcon icon={faArrowUpWideShort} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDownShortWide} />
                    )
                  }
                >
                  $ Rate
                </Button>
                <Button
                  onClick={() => handleSort('distance')}
                  endIcon={
                    sortOrder.distance === 'asc' ? (
                      <FontAwesomeIcon icon={faArrowUpWideShort} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDownShortWide} />
                    )
                  }
                >
                  Distance
                </Button>
              </ButtonGroup>
            </div>
          </div>

          <Box id='meter-container' className='meter-container'>
            {currentMeterComps}
          </Box>
        </div>
      )}
    </div>
  )
}
