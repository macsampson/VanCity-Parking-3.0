export default function getDirections(
	rawMeterInfo,
	setRawMeterInfo,
	selectedPlace
) {
	const meters = Object.values(rawMeterInfo.data)
	// console.log('meters in get directions: ', meters)
	meters.forEach((meter) => {
		const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${meter.location.lng},${meter.location.lat};${selectedPlace.lng},${selectedPlace.lat}?geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_KEY}`
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				const newMeterInfo = {
					...rawMeterInfo.data,
				}
				// get each meter using the coordinates as the key and update the distance and duration using whole numbers
				newMeterInfo[
					meter.location.lng + ',' + meter.location.lat
				].distance = data.routes[0].distance.toFixed(0)
				newMeterInfo[
					meter.location.lng + ',' + meter.location.lat
				].duration = data.routes[0].duration.toFixed(0)
				setRawMeterInfo((prevState) => ({
					...prevState,
					data: newMeterInfo,
				}))
			})
			.catch((error) => {
				console.log(error)
			})
	})
	setRawMeterInfo((prevState) => ({ ...prevState, secondApiCall: true }))
}
