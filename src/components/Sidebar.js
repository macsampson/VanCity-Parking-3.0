import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import MeterInfo from './MeterInfo'
import fetchParkingMeters from '../utils/FetchParkingMeters'
import getDirections from '../utils/GetDirections'
import { Button, ButtonGroup } from '@mui/material'
import { render } from 'react-dom'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export default function Sidebar(props) {
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [markers, setMarkers] = useState({})
	const [rawMeterInfo, setRawMeterInfo] = useState([])
	const [currentMeterId, setCurrentMeterId] = useState(null)
	const [currentMeters, setCurrentMeters] = useState([])
	const [currentMeterComps, setCurrentMeterComps] = useState([])
	const [sortOrder, setSortOrder] = useState({ rate: 'asc', distance: 'asc' })

	const meterInfoRef = useRef(null) // reference to meter info card to scroll to

	// function to handle meter click
	const handleMeterClick = (meter) => {
		// console.log('meter clicked', meter)
		props.clickedMeter(meter[0])
		setCurrentMeterId(meter[0])
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
		// props.clickedMarker(null)
		setCurrentMeters(sortedCurrentMeters)
		// get reference to the sidebar and scroll to top
		const sidebar = document.getElementById('meter-container')
		sidebar.scrollTop = 0

		setSortOrder((prev) => ({
			...prev,
			[sortType]: prev[sortType] === 'asc' ? 'desc' : 'asc',
		}))
	}

	// function to render meter info
	useEffect(() => {
		console.log('rendering meter info', currentMeterId)
		if (currentMeters) {
			const newCurrentMeterComps = currentMeters.map((meter) => {
				return (
					<MeterInfo
						key={meter.meter_id}
						meter={meter}
						expanded={meter.meter_id == currentMeterId}
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
						dataWithDirections[
							meter.location.lng + ',' + meter.location.lat
						] = meter
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
				} finally {
					// setIsLoading(false)
					// console.log('finally returned')
				}
			}
			fetchMeterInfo()
		}
	}, [selectedPlace])

	// call findmeterinfo when marker is clicked
	// useEffect(() => {
	// 	// console.log('clicked')
	// 	if (props.clickedMarker) {
	// 		//   console.log('clicked', props.clickedMarker)
	// 		setCurrentMeterId(props.clickedMarker.key)
	// 		// expandMeterInfo(props.clickedMarker.key)
	// 	}
	// }, [props.clickedMarker])

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

	const styles = {
		container: {
			height: '87vh',
			flex: '0 0 auto',
			minWidth: '400px',
			maxWidth: '400px',
			background: 'white',
		},
		search: {
			// flex: '0 0 auto',
			padding: '10px',
			zIndex: 1,
			position: 'absolute',
			right: '0px',
			width: '25%',
			// width: '100%',
		},
		sorting: {
			display: 'flex',
			flexDirection: 'column',
			// alignItems: 'center',
			padding: '10px',
			zIndex: 1,
			// position: 'absolute',
			left: '0px',
			// width: '25%',
			height: '8vh',
			// width: '100%',
		},
		sortButtons: {
			// flex: '1 1 auto',
			justifyContent: 'center',
			display: 'flex',
		},
		sortText: {
			alignSelf: 'center',
			flex: '0',
			fontSize: '1.2rem',
			color: 'gray',
		},
		button: {
			flex: '1',
			backgroundColor: 'rgb(81, 209, 251)',
		},
	}

	return (
		<div className="sidebar-container" style={styles.container}>
			<div className="sorting-container" style={styles.sorting}>
				<p style={styles.sortText}>Sort by:</p>
				<div style={styles.sortButtons}>
					<ButtonGroup
						variant="contained"
						aria-label="contained primary button group"
						style={{
							width: '300px',
						}}
					>
						<Button
							style={styles.button}
							onClick={() => handleSort('rate')}
							endIcon={
								sortOrder.rate === 'asc' ? (
									<ArrowUpwardIcon />
								) : (
									<ArrowDownwardIcon />
								)
							}
						>
							Rate
						</Button>
						<Button
							style={styles.button}
							onClick={() => handleSort('distance')}
							endIcon={
								sortOrder.distance === 'asc' ? (
									<ArrowUpwardIcon />
								) : (
									<ArrowDownwardIcon />
								)
							}
						>
							Distance
						</Button>
					</ButtonGroup>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					//   paddingBottom: "10px",
				}}
			>
				<Box
					id="meter-container"
					style={{
						flex: '0 0 100%',
						overflow: 'scroll',
						padding: '10px',
					}}
				>
					{currentMeterComps}
				</Box>
			</div>
		</div>
	)
}
