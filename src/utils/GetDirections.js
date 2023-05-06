export default async function getDirections(rawMeterInfo, selectedPlace) {
  const meters = Object.values(rawMeterInfo)
  const promises = []
  const durations = []

  meters.forEach((meter) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${meter.location.lng},${meter.location.lat};${selectedPlace.lng},${selectedPlace.lat}?geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_KEY}`
    const promise = fetch(url)
      .then((res) => res.json())
      .then((data) => {
        durations[meter.location.lng + ',' + meter.location.lat] = {
          distance: Number(data.routes[0].distance.toFixed(0)),
          duration: Number(data.routes[0].duration.toFixed(0)),
        }
      })
      .catch((error) => {
        console.log(error)
      })
    promises.push(promise)
  })

  await Promise.all(promises)
  return durations
}
