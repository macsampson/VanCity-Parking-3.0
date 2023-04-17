import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import MeterInfo from './MeterInfo'
import fetchParkingMeters from '../utils/FetchParkingMeters'
import getDirections from '../utils/GetDirections'

export default function Sidebar(props) {
	const [meterType, setMeterType] = useState('Any')
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [markers, setMarkers] = useState([])
	const [rawMeterInfo, setRawMeterInfo] = useState({
		data: [],
		firstApiCall: null,
		secondApiCall: null,
	})
	const [currentMeterId, setCurrentMeterId] = useState(null)
	const [currentMeters, setCurrentMeters] = useState(null)
	// reference to meter info to scroll to
	const meterInfoRef = useRef(null)

	// use effect to set selected place from props
	useEffect(() => {
		setSelectedPlace(props.selectedPlace)
	}, [props.selectedPlace])

	useEffect(() => {
		if (markers) {
			props.onMarkersChange(markers)
		}
	}, [markers])
	// call the fetchParkingMeters function when place prop changes

	useEffect(() => {
		if (selectedPlace) {
			// set rawmeterinfo firstapicall and secondapicall to false
			setRawMeterInfo({
				data: [],
				firstApiCall: false,
				secondApiCall: false,
			})
			// console.log('fetching parking meters')
			// call fetchParkingMeters function
			fetchParkingMeters(selectedPlace, setRawMeterInfo)
		}
	}, [selectedPlace])

	// useeffect to pringt rawmeterinfo when it changes
	useEffect(() => {
		if (rawMeterInfo.firstApiCall) {
			// console.log(rawMeterInfo.data)
			getDirections(rawMeterInfo, setRawMeterInfo, selectedPlace)
		}
	}, [rawMeterInfo.firstApiCall])

	// useffect to update currentmeters when rawmeterinfo.secondapicall changes
	useEffect(() => {
		if (rawMeterInfo.secondApiCall) {
			updateCurrentMeters()
			const newMarkers = []
			for (let key in rawMeterInfo.data) {
				newMarkers.push({
					lng: rawMeterInfo.data[key].location.lng,
					lat: rawMeterInfo.data[key].location.lat,
					key: rawMeterInfo.data[key].meterid,
				})
			}
			setMarkers(newMarkers)
		}
	}, [rawMeterInfo.secondApiCall])

	// call findmeterinfo when marker is clicked
	useEffect(() => {
		// console.log('clicked')
		if (props.clickedMarker) {
			// console.log('clicked', props.clickedMarker)
			setCurrentMeterId(props.clickedMarker.key)
			// expandMeterInfo(props.clickedMarker.key)
		}
	}, [props.clickedMarker])

	// useffect to update currentmeters when rawmeterinfo changes
	useEffect(() => {
		// console.log(rawMeterInfo);

		if (currentMeterId) {
			meterInfoRef.current = document.getElementById(currentMeterId)
		}
	}, [currentMeterId])

	// useffect to scroll to meter when meterinfo ref changes
	useEffect(() => {
		if (meterInfoRef.current) {
			setTimeout(() => {
				meterInfoRef.current.scrollIntoView({ behavior: 'smooth' })
			}, 50)
		}
	}, [meterInfoRef.current])

	// function to update currentMeters when rawMeterInfo changes
	function updateCurrentMeters() {
		if (rawMeterInfo.secondApiCall) {
			console.log('updating current meters')
			const meterComps = []
			for (let key in rawMeterInfo.data) {
				// console.log(rawMeterInfo[key]);
				const meterComp = (
					<MeterInfo
						meter={rawMeterInfo.data[key]}
						expanded={
							rawMeterInfo.data[key].meterid === currentMeterId ? true : false
						}
						key={rawMeterInfo.data[key].meterid}
						onClick={() => {
							props.clickedMeter(rawMeterInfo.data[key])
						}}
					/>
				)
				meterComps.push(meterComp)
			}
			setCurrentMeters(meterComps)
		}
	}

	const styles = {
		container: {
			height: '100vh',
			flex: '0 0 auto',
			minWidth: '400px',
			maxWidth: '400px',
			background: '#e6e6e6',
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
	}

	return (
		<div className="sidebar-container" style={styles.container}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					//   paddingBottom: "10px",
				}}
			>
				<Box
					style={{
						flex: '0 0 100%',
						overflow: 'scroll',
						padding: '10px',
						padding: '10px',
					}}
				>
					{currentMeters}
				</Box>
			</div>
		</div>
	)
}
