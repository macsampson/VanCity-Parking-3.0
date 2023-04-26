export default async function getDirections(rawMeterInfo, selectedPlace) {
	const meters = Object.values(rawMeterInfo)
	let updatedMeterInfo = { ...rawMeterInfo }

	meters.forEach((meter) => {
		const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${meter.location.lng},${meter.location.lat};${selectedPlace.lng},${selectedPlace.lat}?geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_KEY}`
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				let newMeterInfo = {
					...updatedMeterInfo,
				}
				// get each meter using the coordinates as the key and update the distance and duration using whole numbers
				newMeterInfo[
					meter.location.lng + ',' + meter.location.lat
				].distance = data.routes[0].distance.toFixed(0)
				newMeterInfo[
					meter.location.lng + ',' + meter.location.lat
				].duration = data.routes[0].duration.toFixed(0)
				updatedMeterInfo = newMeterInfo
			})
			.catch((error) => {
				console.log(error)
			})
	})
	return updatedMeterInfo
}
