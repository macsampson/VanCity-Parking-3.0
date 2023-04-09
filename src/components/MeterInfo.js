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
			// minWidth: '160px',
		},
		value: {
			fontSize: '16px',
			color: '#333',
			display: 'flex',
			alignItems: 'center',
		},
		icon: {
			fontSize: '16px',
			marginRight: '8px',
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
	}

	const getRate = () => {
		const now = new Date()
		const day = now.getDay()

		if (day === 0) {
			// Sunday
			return meter.sundays_early_rate
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
						<div style={styles.label}>Weekdays Early Rate:</div>
						<div style={styles.value}>{meter.weekdays_early_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Weekdays Early Limit:</div>
						<div style={styles.value}>{meter.weekdays_early_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Weekdays Late Rate:</div>
						<div style={styles.value}>{meter.weekdays_late_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Weekdays Late Limit:</div>
						<div style={styles.value}>{meter.weekdays_late_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Saturdays Early Rate:</div>
						<div style={styles.value}>{meter.saturdays_early_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Saturdays Early Limit:</div>
						<div style={styles.value}>{meter.saturdays_early_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Saturdays Late Rate:</div>
						<div style={styles.value}>{meter.saturdays_late_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Saturdays Late Limit:</div>
						<div style={styles.value}>{meter.saturdays_late_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Sundays Early Rate:</div>
						<div style={styles.value}>{meter.sundays_early_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Sundays Early Limit:</div>
						<div style={styles.value}>{meter.sundays_early_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Sundays Late Rate:</div>
						<div style={styles.value}>{meter.sundays_late_rate}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Sundays Late Limit:</div>
						<div style={styles.value}>{meter.sundays_late_limit}</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Pay by Phone:</div>
						<div style={styles.value}>
							<FontAwesomeIcon icon={faMobileAlt} style={styles.icon} />
							{meter.pay_by_phone}
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Pay by Credit Card:</div>

						<div style={styles.value}>
							<FontAwesomeIcon icon={faCreditCard} style={styles.icon} />
							{meter.credit_card}
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>In Effect:</div>
						<div style={styles.value}>
							<FontAwesomeIcon icon={faClock} style={styles.icon} />
							{meter.in_effect}
						</div>
					</div>
					<div style={styles.row}>
						<div style={styles.label}>Updated:</div>
						<div style={styles.value}>
							<FontAwesomeIcon icon={faSpinner} style={styles.icon} />
							{meter.updated}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default MeterInfo
