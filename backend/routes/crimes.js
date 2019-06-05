// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var Crime = require("../models/meter.crime");

/* GET meters listing. */
router.get("/", (req, res) => {
  var lat = req.query.lat;
  var lng = req.query.lng;

  // Use coordinates in [lat,lng] format, a distance in meters, to query the db and returns meters within the distance radius from the given coordinates
  Crime.find({
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

module.exports = router;
