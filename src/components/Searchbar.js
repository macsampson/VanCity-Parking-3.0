import React, { useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { FormControl } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";

// create bounds object for autocomplete search within vancouver
const bounds = {
  north: 49.384,
  south: 49.12,
  west: -123.3,
  east: -123.0,
};

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: 15,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: "100%",
    border: "1px solid transparent",
    // [theme.breakpoints.up('sm')]: {
    // 	// marginLeft: theme.spacing(3),
    // 	width: 'auto',
    // },
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "93%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    // vertical padding + font size from searchIcon
    // transition: theme.transitions.create('width'),
    width: "100%",
    // [theme.breakpoints.up('md')]: {
    // 	width: '30ch',
    // },
    // backgroundColor: 'white',
    borderRadius: 15,
  },
  clearIcon: {
    color: theme.palette.grey[500],
    position: "absolute",
    right: theme.spacing(1),
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },
}));

function SearchBar(props) {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocomplete) => {
    // console.log('autocomplete: ', autocomplete)
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      // console.log('getting place')
      // console.log(autocomplete.getPlace())
      const place = autocomplete.getPlace();
      setSearchTerm(place.formatted_address);
      props.onSelectPlace(place);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <FormControl className={classes.search}>
      <div className={classes.search} style={{ background: "white" }}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>

        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            bounds: bounds,
          }}
          // autocomplete={autocomplete}
          // Handle the selected place here
        >
          <InputBase
            // id="autocomplete"
            placeholder="Search…"
            value={searchTerm}
            onChange={handleChange}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            // autoFocus={true}
          />
        </Autocomplete>
        {searchTerm && searchTerm.length > 0 && (
          <div className={classes.clearIcon} onClick={handleClear}>
            <ClearIcon />
          </div>
        )}
      </div>
    </FormControl>
  );
}

export default SearchBar;
