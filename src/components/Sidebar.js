import React, { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
// import MenuIcon from '@mui/icons-material/Menu'
// import Switch from '@mui/material/Switch'
import Drawer from '@mui/material/Drawer'
import Searchbar from './Searchbar'
import MeterTypeSelect from './MeterTypeSelect'
import Box from '@mui/material/Box'
// import Grid2 from '@mui/material/Unstable_Grid2'
import MeterInfo from './MeterInfo'
// eslint-disable-next-line no-unused-vars
import { StreetViewPanorama } from '@react-google-maps/api'
// eslint-disable-next-line no-unused-vars
import StreetView from './StreetView'

export default function Sidebar(props) {
	// const [rate, setRate] = useState('Any')
	// const [dollarRate, setDollarRate] = useState('Any')
	const [meterType, setMeterType] = useState('Any')
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [markers, setMarkers] = useState([])
	const [rawMeterInfo, setRawMeterInfo] = useState(null)
	// state object for highlighted meterInfo
	const [highlightedMeterInfo, setHighlightedMeterInfo] = useState(null)
	// state obbject for current meterid
	const [currentMeterId, setCurrentMeterId] = useState(null)

	// state obect for current meters
	const [currentMeters, setCurrentMeters] = useState(null)

	// reference to meter info to scroll to
	const meterInfoRef = useRef(null)

	// state object for list of meterinfo components
	// const [meterInfoList, setMeterInfoList] = useState([])

	// toggle the expanded meterInfo

	// const [crime, setCrime] = useState(false)

	// const onDistanceChange = (event, distance) => {
	//   setDistance(distance)
	//   props.distance(distance)
	// }

	// const onRateChange = (rate) => {
	//   var dollars
	//   if (rate === 10) {
	//     dollars = 'Any'
	//     rate = 'Any'
	//   } else {
	//     dollars = '$' + rate + '.00'
	//   }

	//   setDollarRate(dollars)
	//   setRate(rate)
	//   props.rate(rate)
	// }

	// const handleCrimeChange = (crime) => {
	//   setCrime(crime)
	// }

	// create a function to do a fetch request to 'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=parking-meters' with the lat and lng of the place prop and the radius of 500m
	// create a function to create a marker for each parking meter returned from the fetch request
	function fetchParkingMeters() {
		// create a url with the lat and lng of the place prop and the radius of 500m
		const url = new URL(
			'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=parking-meters'
		)
		// add the lat and lng of the place prop to the url
		url.searchParams.append(
			'geofilter.distance',
			`${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()},500`
		)
		// add the number of rows to the url
		url.searchParams.append('rows', '100')

		// add meter type to the url
		if (meterType !== 'Any') {
			url.searchParams.append('refine.meterhead', meterType)
		}

		// fetch the url
		fetch(url)
			// convert the response to json
			.then((response) => response.json())
			// create a marker for each parking meter returned from the fetch request
			.then((data) => {
				console.log(data)
				const newMarkers = data.records.map((record) => ({
					lng: record.fields.geom.coordinates[0],
					lat: record.fields.geom.coordinates[1],
					key: record.fields.meterid,
				}))
				const newMeterInfo = data.records.map((record) => ({
					meterid: record.fields.meterid,
					meter_type: record.fields.meterhead,
					weekdays_early_rate: record.fields.r_mf_9a_6p,
					weekdays_early_limit: record.fields.t_mf_9a_6p,
					weekdays_late_rate: record.fields.r_mf_6p_10,
					weekdays_late_limit: record.fields.t_mf_6p_10,
					saturdays_early_rate: record.fields.r_sa_9a_6p,
					saturdays_early_limit: record.fields.t_sa_9a_6p,
					saturdays_late_rate: record.fields.r_sa_6p_10,
					saturdays_late_limit: record.fields.t_sa_6p_10,
					sunday_early_rate: record.fields.r_su_9a_6p,
					sunday_early_limit: record.fields.t_su_9a_6p,
					sunday_late_rate: record.fields.r_su_6p_10,
					sunday_late_limit: record.fields.t_su_6p_10,
					pay_by_phone: record.fields.pay_phone,
					credit_card: record.fields.creditcard,
					in_effect: record.fields.timeineffe
						? record.fields.timeineffe.replace('METER IN EFFECT:', '')
						: 'n/a',

					updated: new Date(record.record_timestamp).toLocaleDateString(
						'en-US',
						{
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						}
					),
				}))
				setMarkers(newMarkers)
				setRawMeterInfo(newMeterInfo)
				setCurrentMeterId(null)
			})
	}

	// create function to find meter info by meter id
	// eslint-disable-next-line
	function findMeterInfo(meterid) {
		// console.log('looking for info')
		return rawMeterInfo.find((meter) => meter.meterid === meterid)
	}

	// function to change background color of meterinfo element when marker is clicked unhighlight all other meterinfo elements
	function highlightMeterInfo(currentMeterId) {
		const meterInfoElement = document.getElementById(currentMeterId)
		if (highlightedMeterInfo) {
			const highlightedMeterInfoElement = document.getElementById(
				highlightedMeterInfo
			)
			if (highlightedMeterInfoElement) {
				highlightedMeterInfoElement.style.backgroundColor = '#F9F9F9'
			}
		}

		meterInfoElement.style.backgroundColor = 'lightblue'
		setHighlightedMeterInfo(currentMeterId)
		meterInfoRef.current = meterInfoElement
	}

	// scroll to meter info element
	function scrollToMeterInfo() {
		const meterInfoElement = document.getElementById(currentMeterId)
		meterInfoElement.scrollIntoView({ behavior: 'smooth' })
	}

	// function to expand meter info element if it is collapsed

	// function to render all meter info in sidebar
	function renderAllMeterInfo() {
		if (rawMeterInfo) {
			console.log('rendering all meter info')
			const meterList = []
			for (const meter of rawMeterInfo) {
				if (meter.meterid === currentMeterId) {
					console.log('expanding meter info')
				}
				meterList.push(
					<MeterInfo
						key={meter.meterid}
						meter={meter}
						expanded={meter.meterid === currentMeterId ? true : false}
					/>
				)
			}
			return <div>{meterList}</div>
		}
	}

	// function iterate through currentMeters and update the expanded state of a meter matching the meterid
	function expandMeterInfo(meterid) {
		console.log('expanding meter info')
		const newMeterInfo = currentMeters.map((meter) => {
			if (meter.key === meterid) {
				return { ...meter, expanded: true }
			} else {
				return { ...meter, expanded: false }
			}
		})
		setCurrentMeters(newMeterInfo)
	}

	// function to update currentMeters when rawMeterInfo changes
	function updateCurrentMeters() {
		if (rawMeterInfo) {
			console.log('updating current meters')
			const meterComps = rawMeterInfo.map((meter) => {
				return (
					<MeterInfo
						meter={meter}
						expanded={meter.meterid === currentMeterId ? true : false}
						key={meter.meterid}
					/>
				)
			})
			setCurrentMeters(meterComps)
			console.log('current meters updated')
		}
	}

	// call the fetchParkingMeters function when place prop changes
	useEffect(() => {
		if (selectedPlace) {
			fetchParkingMeters()
		}
	}, [selectedPlace, meterType])

	useEffect(() => {
		if (markers) {
			props.onMarkersChange(markers)
		}
	}, [markers])

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
		updateCurrentMeters()
		if (currentMeterId) {
			meterInfoRef.current = document.getElementById(currentMeterId)
		}
	}, [rawMeterInfo, currentMeterId])

	// useffect to scroll to meter when meterinfo ref changes
	useEffect(() => {
		if (meterInfoRef.current) {
			meterInfoRef.current.scrollIntoView({ behavior: 'smooth' })
			highlightMeterInfo(currentMeterId)
		}
	}, [meterInfoRef.current])

	// call higihtlightmeterinfo when currentmeterid changes
	// useEffect(() => {
	// 	if (currentMeterId) {
	// 		highlightMeterInfo()
	// 	}
	// }, [currentMeterId])

	return (
		<div>
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{
					'.MuiPaper-root': {
						width: '405px',
						padding: '20px',
						order: 1,
					},
				}}
			>
				<Box
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 1,
						backgroundColor: 'white',
						width: '100%',
					}}
				>
					<Searchbar onSelectPlace={setSelectedPlace} />
					<MeterTypeSelect onMeterChange={setMeterType} />
					<div>
						<Button
							onClick={fetchParkingMeters}
							variant="primary"
							type="submit"
							style={{ marginTop: '16px' }}
						>
							Search
						</Button>
					</div>
				</Box>
				<div style={{ marginTop: '80px', overflow: 'auto' }}>
					{currentMeters}
				</div>

				{/* <label>
					<span>Vehicle Crime Overlay</span>
					<Switch onColor={'#007bff'} />
				</label> */}
			</Drawer>
		</div>
	)
}
