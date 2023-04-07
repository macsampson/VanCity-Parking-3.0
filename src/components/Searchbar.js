import React, { useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import { FormControl } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: 15,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    border: '1px solid black',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  clearIcon: {
    color: theme.palette.grey[500],
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
}))

function SearchBar() {
  const classes = useStyles()
  const [searchTerm, setSearchTerm] = useState('')

  const handleClear = () => {
    setSearchTerm('')
  }

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <FormControl>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          id="autocomplete"
          placeholder="Search…"
          value={searchTerm}
          onChange={handleChange}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
        {searchTerm.length > 0 && (
          <div className={classes.clearIcon} onClick={handleClear}>
            <ClearIcon />
          </div>
        )}
      </div>
    </FormControl>
  )
}

export default SearchBar
