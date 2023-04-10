import React, { useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

import { FormControl } from '@mui/material'

function MeterTypeSelect(props) {
	const [meterType, setMeterType] = useState('Any')

	const handleChange = (event) => {
		setMeterType(event.target.value)
		props.onMeterChange(event.target.value)
	}

	return (
		<FormControl style={{ marginTop: '16px', width: '100%' }}>
			<InputLabel id="demo-simple-select-label">Meter Type</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={meterType}
				label="Meter Type"
				onChange={handleChange}
				style={{ borderRadius: '15px' }}
			>
				<MenuItem value="Any">
					<em>Any</em>
				</MenuItem>
				<MenuItem value={'Single'}>Single</MenuItem>
				<MenuItem value={'Twin'}>Twin</MenuItem>
				<MenuItem value={'Motorbike'}>Motorbike</MenuItem>
				<MenuItem value={'Disability'}>Disability</MenuItem>
				<MenuItem value={'Pay Station'}>Pay Station</MenuItem>
				<MenuItem value={'Bay'}>Bay</MenuItem>
			</Select>
		</FormControl>
	)
}

export default MeterTypeSelect
