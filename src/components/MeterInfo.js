import React, { useState, useEffect, useRef } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCreditCard,
	faMobileAlt,
	faPersonWalking,
} from '@fortawesome/free-solid-svg-icons'

const MeterInfo = ({ meter, expanded, meterClicked }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [meterTypes, setMeterTypes] = useState({
		paystation: {
			status: false,
			icon: 'images/pay-station.png',
			label: 'Pay Station',
		},
		disability: {
			status: false,
			icon: 'images/disability.png',
			label: 'Disability',
		},
		motorbike: {
			status: false,
			icon: 'images/motorbike.png',
			label: 'Motorbike',
		},
		ev: { status: false, icon: 'images/ev.png', label: 'EV' },
		single: { status: false, icon: 'images/single.png', label: 'Single' },
		twin: { status: false, icon: 'images/twin.png', label: 'Twin' },
		bay: { status: false, icon: 'images/bay.png', label: 'Bay' },
	})
	const [paymentTypes, setPaymentTypes] = useState({
		creditCard: { status: false, icon: faCreditCard, label: 'Credit Card' },
		payByPhone: { status: false, icon: faMobileAlt, label: 'Pay By Phone' },
	})
	const [duration, setDuration] = useState(null)

	// state to hold meter address
	//   const [meterAddress, setMeterAddress] = useState(null)

	const containerRef = useRef(null)

	// const toggleExpand = () => {
	// 	setIsExpanded(!isExpanded)
	// }

	// handleclick function that calls toggleExpand and passes meter id to parent
	const handleClick = () => {
		// toggleExpand()
		meterClicked(meter.meter_id)
	}

	// toggle expanded meterInfo when expanded prop changes
	useEffect(() => {
		setIsExpanded(expanded)
	}, [expanded])

	// set meter type state object
	useEffect(() => {
		// iterate through meter.meter_types and set meterType state status to true if meter has that type
		let tempTypes = { ...meterTypes }
		for (const [key, type] of Object.entries(meter.meter_types)) {
			// console.log(type, tempTypes[type])
			tempTypes[type] = {
				...tempTypes[type],
				status: true,
			}
		}
		setMeterTypes(tempTypes)

		setPaymentTypes({
			...paymentTypes,
			creditCard: {
				...paymentTypes.creditCard,
				status: meter.credit_card === 'Yes',
			},
			payByPhone: {
				...paymentTypes.payByPhone,
				status: meter.pay_by_phone !== null,
			},
		})

		setDuration(Math.floor(meter.duration / 60))
	}, [meter])

	const daysOfWeek = [
		{
			label: 'Weekdays',
			earlyRate: 'weekdays_early_rate',
			earlyLimit: 'weekdays_early_limit',
			lateRate: 'weekdays_late_rate',
			lateLimit: 'weekdays_late_limit',
		},
		{
			label: 'Saturdays',
			earlyRate: 'saturdays_early_rate',
			earlyLimit: 'saturdays_early_limit',
			lateRate: 'saturdays_late_rate',
			lateLimit: 'saturdays_late_limit',
		},
		{
			label: 'Sundays',
			earlyRate: 'sunday_early_rate',
			earlyLimit: 'sunday_early_limit',
			lateRate: 'sunday_late_rate',
			lateLimit: 'sunday_late_limit',
		},
	]

	const styles = {
		container: {
			display: 'block',
			backgroundColor: 'white',
			borderRadius: '8px',
			boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
			width: '100%',
			marginBottom: '8px',
			position: 'relative',
		},
		row: {
			display: 'flex',
			justifyContent: 'space-between',
			width: '100%',
			padding: '8px 0px',
		},
		basic: {
			display: 'flex',
			justifyContent: 'space-between',
			// alignItems: 'center',
			width: '100%',
			// marginBottom: '8px',
			padding: '15px 0px 15px 0px',
		},
		info: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			// alignItems: 'center',
			width: '100%',
			// marginBottom: '8px',
			padding: '15px',
		},
		subInfo: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			// alignItems: 'center',
			width: '100%',
			// marginBottom: '8px',
			padding: '8px',
		},

		label: {
			fontSize: '1.2rem',
			fontWeight: 'bold',
			marginRight: '0px 0px 0px 8px',
		},

		icons: {
			fontSize: '1rem',
			// color: 'black',
			display: 'block',
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row',
			padding: '10px 0px 0px 0px',
		},
		minutes: {
			fontSize: '1rem',
			color: '#333',
			display: 'block',
			alignItems: 'center',
		},
		limit: {
			fontSize: '1rem',
			color: 'orange',
			display: 'block',
			alignItems: 'center',
		},
		rate: {
			fontSize: '1.5rem',
			color: '#333',
			display: 'block',
			alignItems: 'center',
		},
		icon: {
			fontSize: '1.5rem',
			alignItems: 'center',
		},
		iconLabel: {
			display: 'flex',
			fontSize: '1em',
			color: 'gray',
			position: 'relative',
		},
		expandButton: {
			border: 'none',
			background: 'none',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			padding: '8px',
		},
		expandIcon: {
			marginLeft: '4px',
		},
		_expandContent: {
			display: isExpanded ? 'block' : 'none',
			padding: '8px',
		},
		get expandContent() {
			return this._expandContent
		},
		set expandContent(value) {
			this._expandContent = value
		},
		days: {
			display: 'inline-block',
			position: 'relative',
			clip: 'auto',
			overflow: 'hidden',
			zoom: '1',
		},
		timeFrame: {
			display: 'flex',
			justifyContent: 'space-between',
			width: '100%',
			// padding: '8px 0px',
			position: 'relative',
			textAlign: 'right',
			whiteSpace: 'nowrap',
		},
		times: {
			display: 'flex',
			fontSize: '1em',
			color: 'gray',
			float: 'left',
			position: 'relative',
			backgroundColor: 'white',
			padding: '0px 0px 10px 0px',
		},
		value: {
			fontSize: '1rem',
			color: '#333',
			position: 'relative',
			backgroundColor: 'white',
		},
		free: {
			fontSize: '1rem',
			color: 'green',
			position: 'relative',
			backgroundColor: 'white',
		},
		filler: {
			position: 'absolute',
			left: '0',
			right: '0',
			borderBottom: '1px dashed lightgray',
			height: '50%',
		},

		titleBar: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			background: 'rgb(81, 209, 251)',
			borderRadius: '8px 8px 0 0',
			color: 'white',
			padding: '8px',
		},
		rateLimit: {
			flex: '1',
			textAlign: 'center',
			margin: 'auto',
		},
		distance: {
			flex: '1',
			textAlign: 'center',
		},
		iconContainer: {
			textAlign: 'center',
			display: 'flex',
			flexDirection: 'column',
			flex: '1',
			alignItems: 'center',
		},
		spots: {
			flex: '1',
			textAlign: 'right',
		},
		address: {
			flex: '1',
		},
	}

	// get icons for payment types
	const getPaymentIcons = () => {
		const payments = []
		// iterate through paymentTypes state object and add icons for each payment type
		for (const [key, value] of Object.entries(paymentTypes)) {
			// console.log(paymentTypes[key])
			if (value.status) {
				payments.push(
					<div
						className="paymentType"
						style={styles.iconContainer}
						key={meter.meter_id + key}
					>
						<FontAwesomeIcon icon={value.icon} style={styles.icon} />

						{key === 'payByPhone' ? (
							<span style={styles.iconLabel}>
								{value.label}: {meter.pay_by_phone}
							</span>
						) : (
							<span style={styles.iconLabel}>{value.label}</span>
						)}
					</div>
				)
			}
		}
		return payments
	}

	// get meter types and icons
	const getMeterTypes = () => {
		const types = []
		// iterate through paymentTypes state object and if status is true, add associated icon image with size 32px x 32px
		for (const [key, value] of Object.entries(meterTypes)) {
			if (value.status) {
				// console.log(value)
				types.push(
					<div
						className="meterType"
						style={styles.iconContainer}
						key={meter.meter_id + key}
					>
						<img src={value.icon} style={styles.icon} alt={value.label} />
						<span style={styles.iconLabel}>{value.label}</span>
					</div>
				)
			}
		}

		return types
	}

	return (
		<div
			className={`meter-info ${isExpanded ? '' : 'hover'}`}
			id={meter.meter_id}
			style={styles.container}
			ref={containerRef}
			onClick={handleClick}
		>
			<div style={styles.titleBar}>
				{/* <div style={styles.address}>{meterAddress}</div> */}
				<div style={styles.spots}>
					{meter.count}
					{meter.count > 1 ? ' spots' : ' spot'}
				</div>
			</div>
			<div style={styles.basic}>
				<div className="rate-limit" style={styles.rateLimit}>
					{meter.current_rate ? (
						<span style={styles.rate}>{'$' + meter.current_rate + '/hr'}</span>
					) : (
						<span style={{ ...styles.rate, color: 'green' }}>Free</span>
					)}
					<span style={styles.limit}>{meter.current_limit} hours</span>
				</div>

				<div className="distance" style={styles.distance}>
					<FontAwesomeIcon icon={faPersonWalking} size="2xl" />
					<span style={styles.minutes}>{duration} min</span>
					<span>to destination</span>
				</div>
			</div>

			{isExpanded && (
				<div style={styles.info}>
					<div style={styles.subInfo}>
						<div style={styles.label}>Meter Types</div>
						<div style={styles.icons}>{getMeterTypes()}</div>
					</div>
					{daysOfWeek.map((day) => (
						<div style={styles.subInfo} key={day.label}>
							<div style={styles.label}>{day.label}</div>
							<div style={styles.days}>
								<div className="meter-times" style={styles.timeFrame}>
									<div style={styles.filler} />
									<span style={styles.times}>
										9am - 6pm&nbsp;
										<span style={styles.limit}>
											(
											{meter[day.earlyLimit] != 'Unlimited'
												? meter[day.earlyLimit]
												: 'No'}{' '}
											hour limit)
										</span>
									</span>
									<span style={styles.value}>
										${meter[day.earlyRate]} per hour
									</span>
								</div>
								<div className="meterTimes" style={styles.timeFrame}>
									<span style={styles.filler} />
									<span style={styles.times}>
										6pm - 10pm&nbsp;
										<span style={styles.limit}>
											(
											{meter[day.lateLimit] != 'Unlimited'
												? meter[day.lateLimit]
												: 'No'}{' '}
											hour limit)
										</span>
									</span>
									<span style={styles.value}>
										${meter[day.lateRate]} per hour
									</span>
								</div>
								<div className="meterTimes" style={styles.timeFrame}>
									<span style={styles.filler} />
									<span style={styles.times}>10pm - 9am</span>
									<span style={styles.free}>Free</span>
								</div>
							</div>
						</div>
					))}

					<div style={styles.subInfo}>
						<div style={styles.label}>Payment Types</div>
						<div style={styles.icons}>{getPaymentIcons()}</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MeterInfo
