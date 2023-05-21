import React, { useState, useEffect, useRef } from 'react'
// import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCreditCard,
  faMobileAlt,
  faPersonWalking,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/MeterInfo.css'

const MeterInfo = ({ meter, expanded, meterClicked, onClosed }) => {
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

  // get icons for payment types
  const getPaymentIcons = () => {
    const payments = []
    // iterate through paymentTypes state object and add icons for each payment type
    for (const [key, value] of Object.entries(paymentTypes)) {
      // console.log(paymentTypes[key])
      if (value.status) {
        payments.push(
          <div className='icon-container' key={`${meter.meter_id}-${key}`}>
            <FontAwesomeIcon icon={value.icon} className='icon' />
            {key === 'payByPhone' ? (
              <span className='icon-label'>
                {value.label}: {meter.pay_by_phone}
              </span>
            ) : (
              <span className='icon-label'>{value.label}</span>
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
          <div className='icon-container' key={`${meter.meter_id}${key}`}>
            <img src={value.icon} className='icon' alt={value.label} />
            <span className='icon-label'>{value.label}</span>
          </div>
        )
      }
    }

    return types
  }

  // if expanded, render all the meter info, otherwise just render the title bar and basic info
  if (isExpanded) {
    return (
      <div
        className={`meter-info-expanded`}
        id={meter.meter_id}
        ref={containerRef}
        onClick={handleClick}
      >
        <div className='title-bar'>
          {/* <div className="address">{meterAddress}</div> */}
          {/* x that sets prop.closed */}

          <div className='spots'>
            {meter.meter_types.includes('twin') ? meter.count * 2 : meter.count}
            {meter.count > 1 ? ' spots' : ' spot'}
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            className='close'
            onClick={onClosed}
          />
        </div>
        <div className='body'>
          <div className='basic'>
            <div className='rate-limit'>
              {meter.current_rate ? (
                <span className='rate'>{'$' + meter.current_rate + '/hr'}</span>
              ) : (
                <span className='rate' style={{ color: 'green' }}>
                  Free
                </span>
              )}
              <span className='limit'>{meter.current_limit} hours</span>
            </div>

            <div className='distance'>
              <FontAwesomeIcon icon={faPersonWalking} size='2xl' />
              <span className='minutes'>{duration} min</span>
              <span>to destination</span>
            </div>
          </div>
          <div className='info'>
            <div className='sub-info'>
              <div className='label'>Meter Types</div>
              <div className='icons'>{getMeterTypes()}</div>
            </div>
            {daysOfWeek.map((day) => (
              <div className='sub-info' key={day.label}>
                <div className='label'>{day.label}</div>
                <div className='days'>
                  <div className='time-frame'>
                    <div className='filler' />
                    <span className='times'>
                      9am - 6pm&nbsp;
                      <span className='limit'>
                        (
                        {meter[day.earlyLimit] !== 'Unlimited'
                          ? meter[day.earlyLimit]
                          : 'No'}{' '}
                        hour limit)
                      </span>
                    </span>
                    <span className='value'>
                      ${meter[day.earlyRate]} per hour
                    </span>
                  </div>
                  <div className='time-frame'>
                    <span className='filler' />
                    <span className='times'>
                      6pm - 10pm&nbsp;
                      <span className='limit'>
                        (
                        {meter[day.lateLimit] !== 'Unlimited'
                          ? meter[day.lateLimit]
                          : 'No'}{' '}
                        hour limit)
                      </span>
                    </span>
                    <span className='value'>
                      ${meter[day.lateRate]} per hour
                    </span>
                  </div>
                  <div className='time-frame'>
                    <span className='filler' />
                    <span className='times'>10pm - 9am&nbsp;</span>
                    <span className='free'>Free</span>
                  </div>
                </div>
              </div>
            ))}

            <div className='sub-info'>
              <div className='label'>Payment Types</div>
              <div className='icons'>{getPaymentIcons()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={`meter-info ${isExpanded ? '' : 'hover'}`}
        id={meter.meter_id}
        ref={containerRef}
        onClick={handleClick}
      >
        <div className='title-bar'>
          {/* <div className="address">{meterAddress}</div> */}
          <div className='spots'>
            {meter.meter_types.includes('twin') ? meter.count * 2 : meter.count}
            {meter.count > 1 ? ' spots' : ' spot'}
          </div>
        </div>
        <div className='basic'>
          <div className='rate-limit'>
            {meter.current_rate ? (
              <span className='rate'>{'$' + meter.current_rate + '/hr'}</span>
            ) : (
              <span className='rate' style={{ color: 'green' }}>
                Free
              </span>
            )}
            <span className='limit'>{meter.current_limit} hours</span>
          </div>

          <div className='distance'>
            <FontAwesomeIcon icon={faPersonWalking} size='2xl' />
            <span className='minutes'>{duration} min</span>
            <span>to destination</span>
          </div>
        </div>
      </div>
    )
  }
}

export default MeterInfo
