// // get meter address from google maps geocoder api using meter location
// const getMeterAddress = async (meter) => {
// 	const url = `https://maps.googleapis.com/maps/api/geocode/json?type=parking&latlng=${meter.location.lat},${meter.location.lng}&key=${process.env.REACT_APP_MAPS_API}`
// 	const response = await fetch(url)
// 	const data = await response.json()
// 	// console.log(data);
// 	// search for neighborhood or premise in address components
// 	// if found, set address to neighborhood or premise
// 	// else set address to formatted address
// 	// const neighborhood = data.results[0].address_components.find(
// 	// 	(component) =>
// 	// 		component.types[0] === 'neighborhood' &&
// 	// 		component.types[1] === 'political'
// 	// )
// 	// find establishment or point of interest in address components
// 	// if found, set address to establishment or point of interest
// 	// else set address to formatted address
// 	const establishment = data.results[0].address_components.find(
// 		(component) =>
// 			component.types[0] === 'establishment' &&
// 			component.types[1] === 'point_of_interest'
// 	)
// 	// if (neighborhood) {
// 	// 	setMeterAddress(neighborhood.long_name)
// 	// } else {
// 	// 	setMeterAddress(data.results[0].formatted_address)
// 	// }
// 	if (establishment) {
// 		setMeterAddress(establishment.short_name)
// 	} else {
// 		setMeterAddress(
// 			data.results[0].address_components[0].short_name +
// 				' ' +
// 				data.results[0].address_components[1].short_name +
// 				', ' +
// 				data.results[0].address_components[2].short_name
// 		)
// 	}

// 	// console.log(data.results[0].address_components)
// 	// setMeterAddress(data.results[0].address_components)
// }

// function to strip out all non-numeric characters from a string
const stripNonNumeric = (string) => {
	let stripped = parseFloat(string.replace(/[^0-9.]/g, ''))
	if (isNaN(stripped)) {
		stripped = 'Unlimited'
	}
	return stripped
}

// functiuon to get current rate and limit
const getRateAndLimit = (meter) => {
	const now = new Date()
	const day = now.getDay()
	const hour = now.getHours()
	let rate, limit

	if (hour >= 9 && hour < 18) {
		// Early
		if (day === 0) {
			// Sunday
			rate = stripNonNumeric(meter.r_su_9a_6p)
			limit = stripNonNumeric(meter.t_su_9a_6p)
		} else if (day === 6) {
			// Saturday
			rate = stripNonNumeric(meter.r_sa_9a_6p)
			limit = stripNonNumeric(meter.t_sa_9a_6p)
		} else {
			// Weekdays
			rate = stripNonNumeric(meter.r_mf_9a_6p)
			limit = stripNonNumeric(meter.t_mf_9a_6p)
		}
	} else if (hour >= 18 && hour < 22) {
		// Late
		if (day === 0) {
			// Sunday
			rate = stripNonNumeric(meter.r_su_6p_10)
			limit = stripNonNumeric(meter.t_su_6p_10)
		} else if (day === 6) {
			// Saturday
			rate = stripNonNumeric(meter.r_sa_6p_10)
			limit = stripNonNumeric(meter.t_sa_6p_10)
		} else {
			// Weekdays
			rate = stripNonNumeric(meter.r_mf_6p_10)
			limit = stripNonNumeric(meter.t_mf_6p_10)
		}
	} else {
		// Outside of business hours
		rate = 0
		limit = 24 - hour + 9
	}

	return { rate, limit }
}

export default async function fetchParkingMeters(selectedPlace) {
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

	const response = await fetch(url)
	const data = await response.json()
	const newMeterInfo = {}

	data.records.forEach((record) => {
		if (!newMeterInfo[record.fields.geom.coordinates]) {
			const currentInfo = getRateAndLimit(record.fields)

			newMeterInfo[record.fields.geom.coordinates] = {
				meter_id: [record.fields.meterid],
				location: {
					lat: record.fields.geom.coordinates[1],
					lng: record.fields.geom.coordinates[0],
				},
				// make meterheads lowercase and split into array on space or slash, unless meterhead equal 'pay station', then make one word
				meter_types: record.fields.meterhead
					.toLowerCase()
					.replace('pay station', 'paystation')
					.replace('single / disability', 'single/disability')
					.split(/\/| /),
				// meter_type: record.fields.meterhead,
				current_rate: currentInfo.rate,
				current_limit: currentInfo.limit,
				weekdays_early_rate: stripNonNumeric(record.fields.r_mf_9a_6p),
				weekdays_early_limit: stripNonNumeric(record.fields.t_mf_9a_6p),
				weekdays_late_rate: stripNonNumeric(record.fields.r_mf_6p_10),
				weekdays_late_limit: stripNonNumeric(record.fields.t_mf_6p_10),
				saturdays_early_rate: stripNonNumeric(record.fields.r_sa_9a_6p),
				saturdays_early_limit: stripNonNumeric(record.fields.t_sa_9a_6p),
				saturdays_late_rate: stripNonNumeric(record.fields.r_sa_6p_10),
				saturdays_late_limit: stripNonNumeric(record.fields.t_sa_6p_10),
				sunday_early_rate: stripNonNumeric(record.fields.r_su_9a_6p),
				sunday_early_limit: stripNonNumeric(record.fields.t_su_9a_6p),
				sunday_late_rate: stripNonNumeric(record.fields.r_su_6p_10),
				sunday_late_limit: stripNonNumeric(record.fields.t_su_6p_10),

				pay_by_phone: record.fields.pay_phone,
				credit_card: record.fields.creditcard,
				count: 1,
			}
		} else {
			// newMeterInfo[record.fields.geom.coordinates].meterid.push(
			// 	record.fields.meterid
			// )

			newMeterInfo[record.fields.geom.coordinates].count++
		}
		// return newMeterInfo
	})

	return newMeterInfo
}
