const mongoose = require("mongoose");
const fs = require("fs");
var request = require("request");
var ftpClient = require("ftp");
var unzip = require("unzip");
var fstream = require("fstream");
var convert = require("xml-js");

const tj = require("@tmcw/togeojson");
const DOMParser = require("xmldom").DOMParser;

var Meter = require("./models/meter.model");

// Connect to Mongo on start
mongoose.connect("mongodb://localhost/parker", {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: false
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
// Create an index on location parameter so we can run geospatial queries on the parking meter dataset
db.collection("meters").createIndex({ geometry: "2dsphere" });

// Do all the meter things
initMeters();

// TODO: Add function to only pull once a week
function checkLastUpdate() {}
// Pull data from remote source and save to local destination
function pullData(source, dest) {
  var writeStream = fs.createWriteStream(dest, {
    flags: "w"
  });
  writeStream.on("open", () => {
    console.log("Pulling data...");
    request.get(source).pipe(writeStream);
    console.log("Data saved!");
  });
}

// Given a local file to unzip, extract it to a destination
function unzipData(source, dest) {
  fs.createReadStream(source).pipe(unzip.Extract({ path: dest }));
  console.log("Data extracted!");
}

// Given a json object, save it to a destination
function saveJSON(json, dest) {
  // Write json to file
  fs.writeFile(dest, JSON.stringify(json), "utf8", function(err) {
    if (err) throw err;
    console.log("JSON written to file successfully.");
  });
}

// Given the json file of parking meters, this function will return the them as a js object in GeoJSON format
function parseMeters(metersJSON) {
  // This is the object that will hold all of our parsed meter info before we write it to a file and insert it into the db
  var parking_meters = {
    type: "FeatureCollection",
    features: []
  };

  pms = metersJSON.features;

  for (let pm of pms) {
    var is_double = pm.geometry.type == "GeometryCollection";
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
            ? time_limits_array[i].match(/(?<=:\s*).*(?=\s*Hr)/)[0].trim()
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
    const id_regex = /(?<=Meter\s?Id:\s).*/gm;
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
      prohibitions = "No";
    }

    // Check if meter is a single or double head
    // Double head meters contain two duplicate coordinates (one for each head), so we only take first set of coordinates (i.e geometries[0])
    lat = is_double
      ? pm.geometry.geometries[0].coordinates[1]
      : pm.geometry.coordinates[1];

    lng = is_double
      ? pm.geometry.geometries[0].coordinates[0]
      : pm.geometry.coordinates[0];

    // Create parking meter object and push onto parking meters array
    parking_meters.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      },
      properties: {
        meter_type: type,
        meter_id: meter_id,
        limits_and_rates: {
          weekdays: weekday_info, // These day data are already in array format
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
        date_updated: Date()
      }
    });
  }
  return parking_meters;
}

// Function to check if a meter exists with a given id...if it does, update record with newly pulled info, otherwise create it
function updateDBMeters(parking_meters) {
  for (let new_meter of parking_meters.features) {
    Meter.updateOne(
      { "properties.meter_id": new_meter.properties.meter_id },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            new_meter.geometry.coordinates[0],
            new_meter.geometry.coordinates[1]
          ]
        },
        properties: {
          meter_type: new_meter.properties.meter_type,
          meter_id: new_meter.properties.meter_id,
          limits_and_rates: {
            weekdays: new_meter.properties.limits_and_rates.weekdays,
            saturday: new_meter.properties.limits_and_rates.saturday,
            sunday: new_meter.properties.limits_and_rates.sunday,
            time_misc: new_meter.properties.limits_and_rates.time_misc,
            rate_misc: new_meter.properties.limits_and_rates.rate_misc
          },
          pay_by_phone_num: new_meter.properties.pay_by_phone_num,
          in_effect: {
            start: new_meter.properties.in_effect.start,
            end: new_meter.properties.in_effect.end
          },
          credit_card: new_meter.properties.credit_card,
          prohibitions: new_meter.properties.prohibitions,
          date_updated: Date()
        }
      },
      { upsert: true, multi: true }
    ).catch(err => {
      console.log(err);
    });
  }
  console.log("Parking meters saved to Mongo in GeoJSON format");
}

function initMeters() {
  pullData(
    "https://data.vancouver.ca/download/kml/parking_meter_rates_and_time_limits.kmz",
    "./data/parking_meters.kmz"
  );
  unzipData("./data/parking_meters.kmz", "./data/");

  // node doesn't have xml parsing or a dom. use xmldom
  const kml = new DOMParser().parseFromString(
    fs.readFileSync("./data/parking_meter_rates_and_time_limits.kml", "utf8")
  );

  const dirtyjson = tj.kml(kml, { styles: true });
  saveJSON(dirtyjson, "./data/parking_meters_dirty.json");

  const geo_parking_meters = parseMeters(dirtyjson);
  // Turn the json object into a string to get ready for writing to a file
  const geojsonstring = JSON.stringify(geo_parking_meters);

  saveJSON(geojsonstring, "./data/parking_meters_clean.json");
  updateDBMeters(geo_parking_meters);
}

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
