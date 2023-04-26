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
		// console.log('selected place changed', selectedPlace)
		if (selectedPlace) {
			const fetchMeterInfo = async () => {
				setRawMeterInfo({
					data: [],
					firstApiCall: false,
					secondApiCall: false,
				})
				try {
					const res = await Promise.all([fetchParkingMeters(selectedPlace)])
					// console.log(data[0])
					const res2 = await Promise.all([getDirections(res[0], selectedPlace)])
					const dataWithDirections = res2[0]
					// console.log(dataWithDirections)
					setRawMeterInfo({
						data: dataWithDirections,
						firstApiCall: true,
						secondApiCall: true,
					})
					setMarkers(
						Object.keys(dataWithDirections).map((key) => {
							const meter = dataWithDirections[key]
							return {
								lng: meter.location.lng,
								lat: meter.location.lat,
								key: meter.meterid,
							}
						})
					)
					setCurrentMeters(
						Object.values(dataWithDirections).map((meter) => (
							<MeterInfo
								meter={meter}
								expanded={meter.meterid === currentMeterId}
								key={meter.meterid}
								onClick={() => {
									props.clickedMeter(meter)
								}}
							/>
						))
					)
				} catch (error) {
					console.error(error)
				}
			}
			fetchMeterInfo()
		}
	}, [selectedPlace])

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
