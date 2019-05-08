var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");
var request = require("request");
var ftpClient = require("ftp");
var unzip = require("unzip");
var fstream = require("fstream");
var convert = require("xml-js");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Connect to Mongo on start
mongoose.connect("mongodb://localhost/parker", { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Pull parking meter data and save to data directory
var writeStream = fs.createWriteStream("./data/parking_meters.kmz", {
  flags: "w"
});
writeStream.on("open", () => {
  console.log("Pulling parking meter data...");
  request
    .get(
      "https://data.vancouver.ca/download/kml/parking_meter_rates_and_time_limits.kmz"
    )
    .pipe(writeStream);
  console.log("Parking meter data saved!");
});

// Unzip parking meter file when the stream is closed
writeStream.on("close", () => {
  fs.createReadStream("./data/parking_meters.kmz").pipe(
    unzip.Extract({ path: "./data/" })
  );
  console.log("Parking meters extracted!");
});

const tj = require("@tmcw/togeojson");
// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require("xmldom").DOMParser;
const kml = new DOMParser().parseFromString(
  fs.readFileSync("./data/parking_meter_rates_and_time_limits.kml", "utf8")
);
const converted = tj.kml(kml);
const geojson = tj.kml(kml, { styles: true });

var parking_meters = {
  pm: []
};

pms = geojson.features;

for (var i in pms) {
  var pm = pms[i];
  if (pm.geometry.type == "Point") {
    const na = "N/A";
    const type_regex = /(?<=Type:\s\n).+/gm;
    head_type = pm.properties.name;
    var type_exists = type_regex.test(head_type);

    if (type_exists) {
      type = head_type.match(type_regex)[0];
    } else {
      type = "N/A";
    }

    // Set some regex for use later on
    const time_limit_regex = /(?<=Time Limits:\s\n<br>)[^]+(?=\n<br>Parking)/gm;
    const rates_and_days_regex = /(?<=Rates:\s\n<br>)[^]+\$[0-9]*\.[0-9]*/gm;

    const weekday_regex = /M-F/;
    const sat_regex = /Sat/;
    const sun_regex = /Sun/;

    const rate_regex = /(\$\s?.*)/gm;

    var desc = pm.properties.description;

    var time_limits_exist = time_limit_regex.test(desc);
    var rates_and_days_exist = rates_and_days_regex.test(desc);

    var weekday_info = [];
    var sat_info = [];
    var sun_info = [];
    var time_misc = "";
    var rate_misc = "";

    // Create an array containing the days, times, and corresponding rates
    if (rates_and_days_exist) {
      var rate_day_array = desc
        .match(rates_and_days_regex)[0]
        .trim()
        .split("\n<br>");
    }

    if (time_limits_exist) {
      // Create an array containing the days, times, and corresponding time limits
      var time_limits_array = desc
        .match(time_limit_regex)[0]
        .replace(/\n/g, "")
        .split("<br>");
      for (var i in time_limits_array) {
        // console.log(time_limits_array[i]);
        var day_info = [];
        // Determine what day the current time limits are for
        if (weekday_regex.test(time_limits_array[i])) {
          day_info = weekday_info;
        } else if (sat_regex.test(time_limits_array[i])) {
          day_info = sat_info;
        } else if (sun_regex.test(time_limits_array[i])) {
          day_info = sun_info;
        } else if (/Miscellaneous:/.test(time_limits_array[i])) {
          time_misc = time_limits_array[i].match(/(?<=Miscellaneous:\s).*/)[0];
        }
        // Parse out the time at which rates/limits come into effect
        start = /(?<=\w+\s)\d.+(?=\sto)/.test(time_limits_array[i])
          ? time_limits_array[i].match(/(?<=\w+\s)\d.+(?=\sto)/)[0]
          : "N/A";
        // Parse out the time at which rates/limits are no longer in effect
        end = /(?<=to\s).*(?=:)/.test(time_limits_array[i])
          ? time_limits_array[i].match(/(?<=to\s).*(?=:)/)[0]
          : "N/A";

        // Parse out the parking time limit in hours, or set to "No Time Limit" if there are none
        if (/No Time Limit/.test(time_limits_array[i])) {
          limit = "No Time Limit";
        } else {
          limit = /(?<=:\s*).*(?=\s*Hr)/.test(time_limits_array[i])
            ? time_limits_array[i].match(/(?<=:\s*).*(?=\s*Hr)/)[0]
            : "N/A";
        }
        // Parse out array of rates and their corresponding days
        if (rates_and_days_exist) {
          if (/Miscellaneous:/.test(rate_day_array[i])) {
            rate_misc = rate_day_array[i].match(/(?<=Miscellaneous:\s).*/)[0];
          } else if (rate_regex.test(rate_day_array[i])) {
            // console.log(rate_day_array[i]);
            rate = rate_day_array[i].match(rate_regex)[0];
          }
        }
        var info = {
          start: start,
          end: end,
          rate: rate,
          hour_limit: limit
        };
        day_info.push(info);
        // console.log(info);
      }
    }

    // Check if the parking meter accepts pay-by-phone, and if so, parse number
    const pay_regex = /(?<=Pay by Phone Number:\s)[0-9]+/gm;
    var pay_exists = pay_regex.test(desc);

    if (pay_exists) {
      pay_by_phone_num = desc.match(pay_regex)[0];
    } else {
      pay_by_phone_num = "N/A";
    }

    // Parse the unique meter ID
    const id_regex = /(?<=Meter Id:\s).*/gm;
    var id_exists = id_regex.test(desc);

    if (id_exists) {
      meter_id = desc.match(id_regex)[0];
    } else {
      meter_id = "N/A";
    }

    // Parse out the hours in which the parking meter is in effect
    const in_effect_regex = /(?<=Effect:\s).*/gm;
    var in_effect_exists = in_effect_regex.test(desc);

    if (in_effect_exists) {
      in_effect = desc.match(in_effect_regex)[0];
      start = /\d.*(?=\sTO)/.test(in_effect)
        ? in_effect.match(/\d.*(?=\sTO)/)[0]
        : "N/A";
      end = /\d.*(?=\sTO)/.test(in_effect)
        ? in_effect.match(/(?<=TO\s)\d.*/)[0]
        : "N/A";
    } else {
      in_effect = "N/A";
    }

    // Check if the parking meters accept credit cards
    const credit_regex = /(?<=Credit Card Enabled:\s).+(?=<br>)/gm;
    var credit_exists = credit_regex.test(desc);

    if (credit_exists) {
      credit = desc.match(credit_regex)[0];
    } else {
      credit = "No";
    }

    // Check if there are any parking prohibitions
    const prohibtion_regex = /(?<=Prohibitions:\s).+(?=<br>Credit)/gm;
    var prohibtion_exists = prohibtion_regex.test(desc);

    if (prohibtion_exists) {
      prohibitions = desc.match(prohibtion_regex)[0];
    } else {
      prohibitions = "N/A";
    }

    // Create parking meter object and push onto parking meters array
    parking_meters.pm.push({
      meter_type: type,
      meter_id: meter_id,
      limits_and_rates: {
        weekdays: weekday_info,
        saturday: sat_info,
        sunday: sun_info,
        time_misc: time_misc,
        rate_misc: rate_misc
      },
      pay_by_phone_num: pay_by_phone_num,
      in_effect: {
        start: start,
        end: end
      },
      credit_card: credit,
      prohibitions: prohibitions,
      lat: pm.geometry.coordinates[1],
      lng: pm.geometry.coordinates[0],
      date_updated: Date()
    });
  }
}

// Print out the parking meter for testing purposes
console.log(parking_meters);

// Turn the json object into a string to get ready for writing to a file
const geojsonstring = JSON.stringify(parking_meters);

// Write json to file
fs.writeFile(
  "./data/parking_meters.json",
  geojsonstring,
  "utf8",
  // callback function that is called after writing file is done
  function(err) {
    if (err) throw err;
    // if no error
    console.log(
      "Parking meter converted to GeoJSON and written to file successfully."
    );
  }
);

// TODO: Figure out this crime data ftp stuff
// Pull and save crime data to the data directory
// var c = new ftpClient();

// c.on("ready", function() {
//   console.log("Pulling crime data...");
//   c.get(
//     "ftp://webftp.vancouver.ca/opendata/json/crime_json_all_years.zip",
//     (err, stream) => {
//       if (err) {
//         c.end();
//         return reject(err);
//       }

//       var writeStream = fs.createWriteStream("./data/crime_data.zip", {
//         flags: "w"
//       });

//       writeStream.on("finish", result => {
//         c.end();
//         console.log("Crime data saved!");
//       });

//       writeStream.on("close", result => {
//         // handling close
//         c.end();
//         console.log("Crime data saved!");
//       });

//       stream.pipe(writeStream);
//     }
//   );
// });

// c.on("close", () => {
//   fs.createReadStream("./data/crime_data.zip").pipe(
//     unzip.Extract({ path: "./data/" })
//   );
// });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
