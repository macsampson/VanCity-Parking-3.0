import React, { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
// import MenuIcon from '@mui/icons-material/Menu'
// import Switch from '@mui/material/Switch'
import Searchbar from './Searchbar'
import MeterTypeSelect from './MeterTypeSelect'
import Box from '@mui/material/Box'
// import Grid2 from '@mui/material/Unstable_Grid2'
import MeterInfo from './MeterInfo'
import { DistanceMatrixService } from '@react-google-maps/api'
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars

export default function Sidebar(props) {
	// const [rate, setRate] = useState('Any')
	// const [dollarRate, setDollarRate] = useState('Any')
	const [meterType, setMeterType] = useState('Any')
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [markers, setMarkers] = useState([])
	const [rawMeterInfo, setRawMeterInfo] = useState([])
	// create state object that is a map of meterid to meterinfo

	// state object for highlighted meterInfo
	const [highlightedMeterInfo, setHighlightedMeterInfo] = useState(null)
	// state obbject for current meterid
	const [currentMeterId, setCurrentMeterId] = useState(null)

	// state obect for current meters
	const [currentMeters, setCurrentMeters] = useState(null)

	// reference to meter info to scroll to
	const meterInfoRef = useRef(null)

	// use effect to set selected place from props
	useEffect(() => {
		setSelectedPlace(props.selectedPlace)
	}, [props.selectedPlace])

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

	function onDistanceMatrixResponse(response, status) {
		if (status === 'OK') {
			// Handle the response here
			console.log(response)
		} else {
			console.log('Error', status)
		}
	}

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
			`${selectedPlace.lat},${selectedPlace.lng},500`
		)
		// add the number of rows to the url
		url.searchParams.append('rows', '50')

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
				// console.log(data);
				// const newMarkers = [];
				const newMeterInfo = {}
				// iterate through data.records and push a new meter object into the newMeterInfo hashmap with the location as the key and the meterinfo as the value
				// if a meter with the same location already exists, add the meterid to the meterinfo object and increment the count
				data.records.forEach((record) => {
					if (!newMeterInfo[record.fields.geom.coordinates]) {
						newMeterInfo[record.fields.geom.coordinates] = {
							meterid: [record.fields.meterid],
							location: {
								lat: record.fields.geom.coordinates[1],
								lng: record.fields.geom.coordinates[0],
							},
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
							count: 1,
						}
					} else {
						newMeterInfo[record.fields.geom.coordinates].meterid.push(
							record.fields.meterid
						)

						newMeterInfo[record.fields.geom.coordinates].count++
					}
				})

				setRawMeterInfo(newMeterInfo)
				// console.log(newMeterInfo);
			})
			// catch any errors
			.catch((error) => {
				console.log(error)
			})
	}

	// create function to find meter info by meter id
	// eslint-disable-next-line
	// function findMeterInfo(meterid) {
	// 	// console.log('looking for info')
	// 	return rawMeterInfo.find((meter) => meter.meterid === meterid)
	// }

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

	function getOrigins() {
		const origins = []
		Object.keys(rawMeterInfo)
			.slice(0, 25)
			.forEach((key) => {
				origins.push({
					lat: rawMeterInfo[key].location.lat,
					lng: rawMeterInfo[key].location.lng,
				})
			})
		return origins
	}

	function getDistances() {
		// fetch distance from each meter to the selected place using the google maps distance matrix

		const service = new window.google.maps.DistanceMatrixService()
		// console.log("service: ", service);
		// console.log(rawMeterInfo.slice(0, 25));
		service.getDistanceMatrix(
			{
				origins: getOrigins(),
				destinations: [
					{
						lat: selectedPlace.lat,
						lng: selectedPlace.lng,
					},
				],
				travelMode: window.google.maps.TravelMode.WALKING,
			},
			(response, status) => {
				if (status === window.google.maps.DistanceMatrixStatus.OK) {
					console.log('response: ', response)
					// const newMeterInfo = response.rows.map((row, index) => ({
					//   rawMeterInfo[].distance= row.elements[0].distance.value,
					// }));
					// setRawMeterInfo(newMeterInfo);
				} else {
					console.log('error', status)
				}
			}
		)
	}

	// scroll to meter info element
	// function scrollToMeterInfo() {
	// 	const meterInfoElement = document.getElementById(currentMeterId)
	// 	meterInfoElement.scrollIntoView({ behavior: 'smooth' })
	// }

	// function to expand meter info element if it is collapsed

	// function to render all meter info in sidebar
	// function renderAllMeterInfo() {
	// 	if (rawMeterInfo) {
	// 		console.log('rendering all meter info')
	// 		const meterList = []
	// 		for (const meter of rawMeterInfo) {
	// 			if (meter.meterid === currentMeterId) {
	// 				console.log('expanding meter info')
	// 			}
	// 			meterList.push(
	// 				<MeterInfo
	// 					key={meter.meterid}
	// 					meter={meter}
	// 					expanded={meter.meterid === currentMeterId ? true : false}
	// 				/>
	// 			)
	// 		}
	// 		return <div>{meterList}</div>
	// 	}
	// }

	// function iterate through currentMeters and update the expanded state of a meter matching the meterid
	// function expandMeterInfo(meterid) {
	// 	console.log('expanding meter info')
	// 	const newMeterInfo = currentMeters.map((meter) => {
	// 		if (meter.key === meterid) {
	// 			return { ...meter, expanded: true }
	// 		} else {
	// 			return { ...meter, expanded: false }
	// 		}
	// 	})
	// 	setCurrentMeters(newMeterInfo)
	// }

	// function to update currentMeters when rawMeterInfo changes
	function updateCurrentMeters() {
		if (rawMeterInfo) {
			console.log('updating current meters')
			const meterComps = []
			for (let key in rawMeterInfo) {
				// console.log(rawMeterInfo[key]);
				const meterComp = (
					<MeterInfo
						meter={rawMeterInfo[key]}
						expanded={
							rawMeterInfo[key].meterid === currentMeterId ? true : false
						}
						key={rawMeterInfo[key].meterid}
						onClick={() => {
							props.clickedMeter(rawMeterInfo[key])
						}}
					/>
				)
				meterComps.push(meterComp)
			}
			setCurrentMeters(meterComps)
			console.log('current meters updated')
		}
	}

	// call the fetchParkingMeters function when place prop changes
	useEffect(() => {
		if (selectedPlace) {
			console.log('fetching parking meters')
			fetchParkingMeters()
			// console.log(selectedPlace);
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
		// console.log(rawMeterInfo);

		updateCurrentMeters()
		if (currentMeterId) {
			meterInfoRef.current = document.getElementById(currentMeterId)
		}
		if (rawMeterInfo && selectedPlace) {
			getDistances()
			const newMarkers = []
			for (let key in rawMeterInfo) {
				newMarkers.push({
					lng: rawMeterInfo[key].location.lng,
					lat: rawMeterInfo[key].location.lat,
					key: rawMeterInfo[key].meterid,
				})
			}
			setMarkers(newMarkers)
		}
	}, [rawMeterInfo, currentMeterId])

	// useffect to scroll to meter when meterinfo ref changes
	useEffect(() => {
		if (meterInfoRef.current) {
			// highlightMeterInfo(currentMeterId)

			setTimeout(() => {
				meterInfoRef.current.scrollIntoView({ behavior: 'smooth' })
			}, 50)
		}
	}, [meterInfoRef.current])

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
				{/* <Box className="searchbar-container" style={styles.search}>
          <Searchbar onSelectPlace={setSelectedPlace} />
        </Box> */}
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
