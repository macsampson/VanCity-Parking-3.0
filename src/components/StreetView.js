import React, { useState } from 'react'
import { StreetViewPanorama } from '@react-google-maps/api'

function StreetView(props) {
	const [pano, setPano] = useState(null)

	const onLoad = (panorama) => {
		setPano(panorama)
	}

	const onUnmount = () => {
		setPano(null)
	}

	const getStreetViewImage = () => {
		const streetViewService = new window.google.maps.StreetViewService()

		streetViewService.getPanorama(
			{
				location: props.position,
				source: window.google.maps.StreetViewSource.OUTDOOR,
				preference: window.google.maps.StreetViewPreference.NEAREST,
				radius: 50,
			},
			(data, status) => {
				if (status === 'OK') {
					const url = `https://maps.googleapis.com/maps/api/streetview?size=300x300&location=${props.position.lat()},${props.position.lng()}&fov=90&heading=${
						data.links[0].heading
					}&pitch=0&key=${process.env.REACT_APP_MAPS_API}`
					console.log(url)
				} else {
					console.error(
						`Street View data not found for this location. Status: ${status}`
					)
				}
			}
		)
	}

	return (
		<StreetViewPanorama
			onLoad={onLoad}
			onUnmount={onUnmount}
			position={props.position}
			visible={true}
			options={{
				disableDefaultUI: true,
				zoomControl: true,
			}}
		/>
	)
}

export default StreetView
