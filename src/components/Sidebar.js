import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
// import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import Searchbar from './Searchbar'
import MeterTypeSelect from './MeterTypeSelect'
// import Grid2 from '@mui/material/Unstable_Grid2'
import MeterInfo from './MeterInfo'
import { StreetViewPanorama } from '@react-google-maps/api'
import StreetView from './StreetView'

export default function Sidebar(props) {
	// const [rate, setRate] = useState('Any')
	// const [dollarRate, setDollarRate] = useState('Any')
	const [meterType, setMeterType] = useState('Any')
	const [selectedPlace, setSelectedPlace] = useState(null)
	const [markers, setMarkers] = useState([])
	const [meterInfo, setMeterInfo] = useState(null)

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
				setMeterInfo(newMeterInfo)
			})
	}

	// create function to find meter info by meter id
	function findMeterInfo(meterid) {
		// console.log('looking for info')
		return meterInfo.find((meter) => meter.meterid === meterid)
	}

	// function to render meter info in sidebar
	function renderMeterInfo() {
		if (props.clickedMarker) {
			const meter = findMeterInfo(props.clickedMarker.key)
			console.log(meter)
			if (meter) {
				return (
					<div>
						<MeterInfo meter={meter} />
						{/* <StreetView meter={meter} /> */}
					</div>
				)
			}
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
			renderMeterInfo()
		}
	}, [props.clickedMarker])

	return (
		<div>
			<Drawer
				variant="permanent"
				anchor="left"
				sx={{
					'.MuiPaper-root': {
						width: '405px',
						padding: '20px',
					},
				}}
			>
				<Searchbar onSelectPlace={setSelectedPlace} />
				<MeterTypeSelect onMeterChange={setMeterType} />
				<Button
					onClick={fetchParkingMeters}
					variant="primary"
					type="submit"
					style={{ marginTop: '16px' }}
				>
					Search
				</Button>
				{renderMeterInfo()}

				{/* <label style={labelStyle}>
            <span>Vehicle Theft Overlay</span>
            <Switch
              onChange={this.handleChange}
              checked={this.state.crime}
              onColor={"#007bff"}
            />
          </label> */}
			</Drawer>
		</div>
	)
}
