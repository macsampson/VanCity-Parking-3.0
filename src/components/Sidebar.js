import React, { useState } from 'react'
import Button from '@mui/material/Button'
// import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import Searchbar from './Searchbar'
import MeterTypeSelect from './MeterTypeSelect'
// import Grid2 from '@mui/material/Unstable_Grid2'

export default function Sidebar(props) {
  // const [rate, setRate] = useState('Any')
  // const [dollarRate, setDollarRate] = useState('Any')
  // const [distance, setDistance] = useState(100)
  const [meterType, setMeterType] = useState('Any')
  // const [crime, setCrime] = useState(false)
  // const [navExpanded, setNavExpanded] = useState(false);

  // const onDistanceChange = (event, distance) => {
  //   setDistance(distance)
  //   props.distance(distance)
  // }

  // const onRateChange = (rate) => {
  //   var dollars
  //   if (rate === 10) {
  //     dollars = 'Any'
  //     rate = 'Any'
  //   } else {
  //     dollars = '$' + rate + '.00'
  //   }

  //   setDollarRate(dollars)
  //   setRate(rate)
  //   props.rate(rate)
  // }

  const handleMeterChange = (e) => {
    setMeterType(e.target.value)
    props.type(e.target.value)
  }

  const onSearch = (e) => {
    props.search(e)
  }

  // const handleCrimeChange = (crime) => {
  //   setCrime(crime)
  // }

  return (
    <div>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{ '.MuiPaper-root': { width: '405px', padding: '20px' } }}
      >
        <Searchbar />
        <MeterTypeSelect onMeterChange={handleMeterChange} />
        <Button
          onClick={onSearch}
          variant="primary"
          type="submit"
          style={{ marginTop: '16px' }}
        >
          Search
        </Button>

        {/* <label style={labelStyle}>
            <span>Vehicle Theft Overlay</span>
            <Switch
              onChange={this.handleChange}
              checked={this.state.crime}
              onColor={"#007bff"}
            />
          </label> */}
      </Drawer>
    </div>
  )
}
