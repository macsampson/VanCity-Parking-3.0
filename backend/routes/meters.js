// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var Meter = require("../models/meter.model");
var dbOperations = require("../db");

/* GET meters listing. */
router.get("/", (req, res) => {
  var lat = req.query.lat;
  var lng = req.query.lng;
  var distance = req.query.distance;

  // dbOperations.fetchNearestMeters([lng, lat], distance, function(
  //   results
  // ) {
  //   // Return the results of the db qeury back in JSON form
  //   res.json(results);
  // });

  Meter.find({
    geometry: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: distance
      }
    }
  }).find((err, results) => {
    if (err) console.log(err);
    res.json(results);
  });
});

module.exports = router;
