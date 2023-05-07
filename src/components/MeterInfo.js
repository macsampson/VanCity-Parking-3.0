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
	const [meterTypes, setMeterTypes] = useState([])
	const [paymentTypes, setPaymentTypes] = useState([{ String: Boolean }])
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
		meterClicked(meter.meterid)
	}

	// toggle expanded meterInfo when expanded prop changes
	useEffect(() => {
		setIsExpanded(expanded)
	}, [expanded])

	// set meter type state object
	useEffect(() => {
		const meterTypes = []
		meter.meter_types.forEach((type) => {
			meterTypes.push(type)
		})
		setMeterTypes(meterTypes)

		const paymentTypes = []
		paymentTypes.push({ creditCard: meter.credit_card === 'Yes' })
		paymentTypes.push({ payByPhone: meter.pay_by_phone !== null })
		setPaymentTypes(paymentTypes)
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
			// flexDirection: 'column',
			// alignItems: 'flex-start',
			backgroundColor: '#F9F9F9',
			// padding: '16px',
			borderRadius: '8px',
			boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
			width: '100%',
			marginBottom: '8px',
			// marginTop: '15px',

			// transition: 'transform 0.5s ease-in-out',
			// ':hover': {
			// 	transform: 'scale(1.01)',
			// 	cursor: 'pointer',
			// },
		},
		row: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			// marginBottom: '8px',
			padding: '8px',
		},
		info: {
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
			marginRight: '8px',
		},
		value: {
			fontSize: '1rem',
			color: '#333',
			display: 'block',
			alignItems: 'center',
		},
		limit: {
			fontSize: '1rem',
			color: '#555',
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
			// marginLeft: '8px',
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
		subLabel: {
			display: 'block',
			fontSize: '1em',
			// marginLeft: '8px',
			color: 'gray',
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
		},
		distance: {
			flex: '1',
			textAlign: 'center',
		},
		paymentType: {
			textAlign: 'center',
			// flex: '1',
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
		const icons = []
		paymentTypes.forEach((type) => {
			if (type.creditCard) {
				icons.push(
					<div
						className="paymentType"
						style={styles.paymentType}
						key={meter.meterid + 'creditCard'}
					>
						<FontAwesomeIcon
							icon={faCreditCard}
							style={styles.icon}
							// make key value 'creditCard' appended to meterid to avoid duplicate keys
						/>
						<span style={styles.subLabel}>Credit Card</span>
					</div>
				)
			}
			if (type.payByPhone) {
				icons.push(
					<div
						className="paymentType"
						style={styles.paymentType}
						key={meter.meterid + 'payByPhone'}
					>
						<FontAwesomeIcon icon={faMobileAlt} style={styles.icon} />
						<span style={styles.subLabel}>Phone</span>
					</div>
				)
			}
		})
		return icons
	}

	return (
		<div
			className="meter-info"
			id={meter.meterid}
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
			<div style={styles.row}>
				<div className="rate-limit" style={styles.rateLimit}>
					<span style={styles.rate}>${meter.current_rate}/hr</span>
					<span style={styles.limit}>{meter.current_limit} hours</span>
				</div>

				<div className="distance" style={styles.distance}>
					<FontAwesomeIcon icon={faPersonWalking} size="2xl" />
					<span style={styles.value}>{duration} min</span>
					<span>to destination</span>
				</div>
			</div>

			{isExpanded && (
				<div>
					<div style={styles.info}>
						<div style={styles.label}>Meter Type:</div>
						<div style={styles.subLabel}>{meterTypes.join(', ')}</div>
					</div>
					{daysOfWeek.map((day) => (
						<div style={styles.info} key={day.label}>
							<div style={styles.label}>{day.label}</div>
							<div style={styles.value}>
								<div style={styles.row}>
									<div style={styles.subLabel}>9am-6pm rate:</div>
									<div style={styles.value}>${meter[day.earlyRate]}</div>
									<div style={styles.subLabel}>9am-6pm limit:</div>
									<div style={styles.value}>{meter[day.earlyLimit]} hours</div>
								</div>
								<div style={styles.row}>
									<div style={styles.subLabel}>6pm-10pm rate:</div>
									<div style={styles.value}>${meter[day.lateRate]}</div>
									<div style={styles.subLabel}>6pm-10pm limit:</div>
									<div style={styles.value}>{meter[day.lateLimit]} hours</div>
								</div>
							</div>
						</div>
					))}

					<div style={styles.info}>
						<div style={styles.label}>Payment Types</div>
						<div style={styles.value}>{getPaymentIcons()}</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MeterInfo
