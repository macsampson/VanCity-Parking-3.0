// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var Meter = require("../models/meter.model");

/* GET meters listing. */
router.get("/", (req, res) => {
  var lat = req.query.lat;
  var lng = req.query.lng;
  var distance = req.query.distance;

  // Use coordinates in [lat,lng] format, a distance in meters, to query the db and returns meters within the distance radius from the given coordinates
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
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});

// TODO: Write query to get unique rates from db
router.get("/rates", (req, res) => {});

module.exports = router;
