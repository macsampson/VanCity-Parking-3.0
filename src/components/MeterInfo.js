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
  const [meterType, setMeterType] = useState([])
  const [paymentTypes, setPaymentTypes] = useState([{ String: Boolean }])
  const [duration, setDuration] = useState(null)

  // state to hold meter address
  //   const [meterAddress, setMeterAddress] = useState(null)

  const containerRef = useRef(null)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // handleclick function that calls toggleExpand and passes meter id to parent
  const handleClick = () => {
    toggleExpand()
    meterClicked(meter.meterid)
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
    setDuration(Math.floor(meter.duration / 60))
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
          <div className='paymentType' style={styles.paymentType}>
            <FontAwesomeIcon
              icon={faCreditCard}
              style={styles.icon}
              // make key value 'creditCard' appended to meterid to avoid duplicate keys
              key={meter.meterid + 'creditCard'}
            />
            <span style={styles.subLabel}>Credit Card</span>
          </div>
        )
      }
      if (type.payByPhone) {
        icons.push(
          <div className='paymentType' style={styles.paymentType}>
            <FontAwesomeIcon
              icon={faMobileAlt}
              style={styles.icon}
              key={meter.meterid + 'payByPhone'}
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
      className='meter-info'
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
        <div className='rate-limit' style={styles.rateLimit}>
          <span style={styles.rate}>{rateAndLimit.rate}/hr</span>
          <span style={styles.limit}>{rateAndLimit.limit} hours</span>
        </div>

        <div className='distance' style={styles.distance}>
          <FontAwesomeIcon icon={faPersonWalking} size='2xl' />
          <span style={styles.value}>{duration} min</span>
          <span>to destination</span>
        </div>
      </div>

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
        </div>
      )}
    </div>
  )
}

export default MeterInfo
