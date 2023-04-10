import React, { useState, useEffect } from 'react'
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

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	// toggle expanded meterInfo when expanded prop changes
	useEffect(() => {
		setIsExpanded(expanded)
	}, [expanded])

	const styles = {
		container: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			backgroundColor: '#F9F9F9',
			padding: '16px',
			borderRadius: '8px',
			boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
			width: '100%',
			marginBottom: '16px',
			marginTop: '15px',
		},
		row: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			marginBottom: '8px',
		},
		label: {
			fontSize: '16px',
			fontWeight: 'bold',
			marginRight: '8px',
		},
		value: {
			fontSize: '16px',
			color: '#333',
			display: 'block',
			alignItems: 'center',
		},
		icon: {
			fontSize: '16px',
			marginLeft: '8px',
		},
		expandButton: {
			border: 'none',
			background: 'none',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
		},
		expandIcon: {
			marginLeft: '4px',
		},
		expandContent: {
			display: isExpanded ? 'block' : 'none',
			marginTop: '8px',
		},
		subLabel: {
			display: 'block',
			fontSize: '0.8em',
			marginLeft: '8px',
			color: 'gray',
		},
	}

	const getRate = () => {
		const now = new Date()
		const day = now.getDay()

		if (day === 0) {
			// Sunday
			return meter.sunday_early_rate
		} else if (day === 6) {
			// Saturday
			return meter.saturdays_early_rate
		} else {
			// Weekdays
			const hour = now.getHours()

			if (hour < 9) {
				// Early
				return meter.weekdays_early_rate
			} else {
				// Late
				return meter.weekdays_late_rate
			}
		}
	}

	return (
		<div id={meter.meterid} style={styles.container}>
			<div style={styles.row}>
				<div style={styles.label}>Current Rate:</div>
				<div style={styles.value}>{getRate()}</div>
			</div>
			<button style={styles.expandButton} onClick={toggleExpand}>
				{isExpanded ? 'Hide details' : 'Show details'}
				<FontAwesomeIcon
					icon={isExpanded ? faChevronUp : faChevronDown}
					style={styles.expandIcon}
				/>
			</button>
			{isExpanded && (
				<div style={{ marginTop: '16px' }}>
					<div style={styles.row}>
						<div style={styles.label}>Meter Type:</div>
						<div style={styles.value}>{meter.meter_type}</div>
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
						<div style={styles.label}>Pay by Phone:</div>
						<div style={styles.value}>
							{meter.pay_by_phone}
							<FontAwesomeIcon icon={faMobileAlt} style={styles.icon} />
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Pay by Credit Card:</div>
						<div style={styles.value}>
							{meter.credit_card}
							<FontAwesomeIcon icon={faCreditCard} style={styles.icon} />
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>In Effect:</div>
						<div style={styles.value}>
							{meter.in_effect}
							<FontAwesomeIcon icon={faClock} style={styles.icon} />
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Updated:</div>
						<div style={styles.value}>{meter.updated}</div>
						<FontAwesomeIcon icon={faSpinner} style={styles.icon} />
					</div>
				</div>
			)}
		</div>
	)
}

export default MeterInfo
