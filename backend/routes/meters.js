// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var Meter = require("../models/meter.model");

/* GET meters listing. */
router.get("/", (req, res) => {
  var lat = req.query.lat;
  var lng = req.query.lng;
  var distance = req.query.distance;
  var rate = req.query.rate;
  var type = req.query.type;

  var query = Meter.find({});
  query.where("geometry").near({
    center: {
      type: "Point",
      coordinates: [lng, lat]
    },
    maxDistance: distance
  });

  // Check if the user specified a rate
  if (rate !== "Any") {
    query.where("properties.rates").lte(rate);
  }

  // Check if the user specified a type of meter
  if (type !== "Any") {
    query.where("properties.meter_type").in([type]);
  }

  query.exec((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
