import React, { useState, useEffect, useRef } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCreditCard,
	faMobileAlt,
	faClock,
	faSpinner,
	faChevronUp,
	faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

const MeterInfo = ({ meter, expanded }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [meterType, setMeterType] = useState([])
	const [paymentTypes, setPaymentTypes] = useState([{ String: Boolean }])
	const [currentRate, setCurrentRate] = useState(null)
	// state to hold meter address
	const [meterAddress, setMeterAddress] = useState(null)
	// state object for opacity
	const [opacity, setOpacity] = useState(1)

	// state object for holding distance to destination
	const [distance, setDistance] = useState(null)

	const containerRef = useRef(null)

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	// toggle expanded meterInfo when expanded prop changes
	useEffect(() => {
		setIsExpanded(expanded)
	}, [expanded])

	// set meter type state object
	useEffect(() => {
		const meterType = []
		const meterTypeArray = meter.meter_type.split(/[\s/]+/)
		meterTypeArray.forEach((type) => {
			meterType.push(type)
		})
		setMeterType(meterType)

		const paymentTypes = []
		paymentTypes.push({ creditCard: meter.credit_card === 'Yes' })
		paymentTypes.push({ payByPhone: meter.pay_by_phone !== null })
		setPaymentTypes(paymentTypes)
		setDistance(Math.floor(meter.duration / 60))
	}, [meter])

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
			opacity: opacity,

			transition: 'transform 0.2s ease-in-out',
			':hover': {
				transform: 'scale(1.02)',
			},
		},
		row: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			// marginBottom: '8px',
			padding: '8px',
		},
		label: {
			fontSize: '1rem',
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
			fontSize: '0.8em',
			// marginLeft: '8px',
			color: 'gray',
		},
		titleBar: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			background: '#4dcff9',
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
			flex: '1',
		},
		spots: {
			flex: '1',
			textAlign: 'right',
		},
		address: {
			flex: '1',
		},
	}

	// get rate and limit based on current time and return as object
	// early rate and limit is from 9am-6pm and late rate and limit is from 6pm-10pm
	const getRateAndLimit = () => {
		const now = new Date()
		const day = now.getDay()
		const hour = now.getHours()

		if (day === 0) {
			// Sunday
			if (hour < 18) {
				// Early
				return {
					rate: meter.sunday_early_rate,
					limit: meter.sunday_early_limit,
				}
			} else {
				// Late
				return {
					rate: meter.sunday_late_rate,
					limit: meter.sunday_late_limit,
				}
			}
		} else if (day === 6) {
			// Saturday
			if (hour < 18) {
				// Early
				return {
					rate: meter.saturdays_early_rate,
					limit: meter.saturdays_early_limit,
				}
			} else {
				// Late
				return {
					rate: meter.saturdays_late_rate,
					limit: meter.saturdays_late_limit,
				}
			}
		} else {
			// Weekdays
			if (hour < 18) {
				// Early
				return {
					rate: meter.weekdays_early_rate,
					limit: meter.weekdays_early_limit,
				}
			} else {
				// Late
				return {
					rate: meter.weekdays_late_rate,
					limit: meter.weekdays_late_limit,
				}
			}
		}
	}

	const rateAndLimit = getRateAndLimit()

	// get icons for payment types
	const getPaymentIcons = () => {
		const icons = []
		paymentTypes.forEach((type) => {
			if (type.creditCard) {
				icons.push(
					<div className="paymentType" style={styles.paymentType}>
						<FontAwesomeIcon
							icon={faCreditCard}
							style={styles.icon}
							key="creditCard"
						/>
						<span style={styles.subLabel}>Credit Card</span>
					</div>
				)
			}
			if (type.payByPhone) {
				icons.push(
					<div className="paymentType" style={styles.paymentType}>
						<FontAwesomeIcon
							icon={faMobileAlt}
							style={styles.icon}
							key="payByPhone"
						/>
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
			onClick={toggleExpand}
		>
			<div style={styles.titleBar}>
				<div style={styles.address}>{meterAddress}</div>
				<div style={styles.spots}>
					{meter.count}
					{meter.count > 1 ? ' spots' : ' spot'}
				</div>
			</div>
			<div style={styles.row}>
				<div className="rate-limit" style={styles.rateLimit}>
					<span style={styles.rate}>{rateAndLimit.rate}/hr</span>
					<span style={styles.limit}>{rateAndLimit.limit} hours</span>
				</div>

				<div className="distance" style={styles.distance}>
					{/* {console.log(meter.duration)} */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 50 80"
					>
						<path
							fill="#555555"
							d="M30.686 14.286c4.035 0 7.306-3.198 7.306-7.143S34.722 0 30.686 0C26.65 0 23.38 3.198 23.38 7.143s3.27 7.143 7.306 7.143zm17.505 22.04l-9.897-4.398-6.297-13.023c-.166-.446-.37-.872-.614-1.273l-.15-.31c-.375-.77-.963-1.346-1.62-1.67-.754-.575-1.633-1-2.61-1.216-.57-.126-1.142-.167-1.706-.144-.502-.017-1.036.06-1.572.25-.865.248-1.68.662-2.405 1.22l-14.785 7.86c-.267.14-.503.306-.727.483-.723.39-1.277 1.084-1.44 1.96L2.058 38.36c-.29 1.54.718 3.022 2.25 3.313 1.53.29 3.005-.723 3.293-2.262L9.77 27.876l7.94-4.222-3.494 15.942c-.106.482-.145.942-.133 1.38l-2.648 16.622c-.06.08-.123.148-.178.234L.834 73.976c-1.304 2.017-1.05 4.51.56 5.56 1.615 1.05 3.977.266 5.28-1.753L17.1 61.64c.328-.513.557-1.053.69-1.59.123-.285.226-.582.277-.902l1.965-12.34c.24.07.482.127.726.18.82.185 1.538.467 2.176.76l10.875 13.05 3.362 16.11c.427 2.043 2.3 3.38 4.18 2.986 1.88-.4 3.063-2.378 2.633-4.426L40.568 59.11c-.134-.646-.425-1.208-.803-1.682-.128-.223-.276-.443-.45-.65L27.973 43.17l3.095-14.108 2.694 5.57c.08.17.176.32.277.473.18.766.665 1.427 1.4 1.755l10.468 4.654c1.31.585 2.882-.105 3.512-1.538.63-1.433.082-3.065-1.23-3.65z"
						></path>
					</svg>
					<span style={styles.value}>{distance} min</span>
					<span>to destination</span>
				</div>
			</div>
			{/* <button style={styles.expandButton} onClick={toggleExpand}>
				{isExpanded ? 'Hide details' : 'Show details'}
				<FontAwesomeIcon
					icon={isExpanded ? faChevronUp : faChevronDown}
					style={styles.expandIcon}
				/>
			</button> */}
			{isExpanded && (
				<div>
					<div style={styles.row}>
						<div style={styles.label}>Meter Type:</div>
						<div style={styles.value}>{meterType.join(',')}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Weekdays:</div>
						<div style={styles.value}>
							<div style={styles.row}>
								<div style={styles.subLabel}>Early Rate:</div>
								<div style={styles.value}>{meter.weekdays_early_rate}</div>
								<div style={styles.subLabel}>Early Limit:</div>
								<div style={styles.value}>{meter.weekdays_early_limit}</div>
							</div>
							<div style={styles.row}>
								<div style={styles.subLabel}>Late Rate:</div>
								<div style={styles.value}>{meter.weekdays_late_rate}</div>
								<div style={styles.subLabel}>Late Limit:</div>
								<div style={styles.value}>{meter.weekdays_late_limit}</div>
							</div>
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Saturdays:</div>
						<div style={styles.value}>
							<div style={styles.row}>
								<div style={styles.subLabel}>Early Rate:</div>
								<div style={styles.value}>{meter.saturdays_early_rate}</div>
								<div style={styles.subLabel}>Early Limit:</div>
								<div style={styles.value}>{meter.saturdays_early_limit}</div>
							</div>
							<div style={styles.row}>
								<div style={styles.subLabel}>Late Rate:</div>
								<div style={styles.value}>{meter.saturdays_late_rate}</div>
								<div style={styles.subLabel}>Late Limit:</div>
								<div style={styles.value}>{meter.saturdays_late_limit}</div>
							</div>
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Sundays:</div>
						<div style={styles.value}>
							<div style={styles.row}>
								<div style={styles.subLabel}>Early Rate:</div>
								<div style={styles.value}>{meter.sunday_early_rate}</div>
								<div style={styles.subLabel}>Early Limit:</div>
								<div style={styles.value}>{meter.sunday_early_limit}</div>
							</div>
							<div style={styles.row}>
								<div style={styles.subLabel}>Late Rate:</div>
								<div style={styles.value}>{meter.sunday_late_rate}</div>
								<div style={styles.subLabel}>Late Limit:</div>
								<div style={styles.value}>{meter.sunday_late_limit}</div>
							</div>
						</div>
					</div>

					<div style={styles.row}>
						<div style={styles.label}>Payment Types:</div>
						{getPaymentIcons()}
					</div>
					{/* <div style={styles.row}>
						<div style={styles.label}>In Effect:</div>
						<div style={styles.value}>
							{meter.in_effect}
							<FontAwesomeIcon icon={faClock} style={styles.icon} /> 
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Updated:</div>
						<div style={styles.value}>{meter.updated}</div>
						 <FontAwesomeIcon icon={faSpinner} style={styles.icon}/>
					</div> */}
				</div>
			)}
		</div>
	)
}

export default MeterInfo
