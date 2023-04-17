export default function fetchParkingMeters(selectedPlace, setRawMeterInfo) {
	// create a url with the lat and lng of the place prop and the radius of 500m
	const url = new URL(
		'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=parking-meters'
	)
	// add the lat and lng of the place prop to the url
	url.searchParams.append(
		'geofilter.distance',
		`${selectedPlace.lat},${selectedPlace.lng},100`
	)
	// add the number of rows to the url
	url.searchParams.append('rows', '50')

	// add meter type to the url
	// if (meterType !== 'Any') {
	// 	url.searchParams.append('refine.meterhead', meterType)
	// }

	// fetch the url
	fetch(url)
		// convert the response to json
		.then((response) => response.json())
		// create a marker for each parking meter returned from the fetch request
		.then((data) => {
			// console.log(data)
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
						distance: 'tbd',
						duration: 'tbd',
					}
				} else {
					newMeterInfo[record.fields.geom.coordinates].meterid.push(
						record.fields.meterid
					)

					newMeterInfo[record.fields.geom.coordinates].count++
				}
			})

			// set the data state property to the newMeterInfo object and set firstApiCall property to true
			setRawMeterInfo((prevState) => ({
				...prevState,
				data: newMeterInfo,
				firstApiCall: true,
			}))
		})
		// catch any errors
		.catch((error) => {
			console.log(error)
		})
}
