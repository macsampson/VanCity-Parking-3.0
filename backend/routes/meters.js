// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var Meter = require("../models/meter.model");

/* GET users listing. */
router.get("/", (req, res, next) => {
  Meter.find((err, meters) => {
    if (err) {
      console.log(err);
    } else {
      res.json(meters);
    }
  });
});

module.exports = router;
