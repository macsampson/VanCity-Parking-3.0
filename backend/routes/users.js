// This file will act as an amalgamation of routes and controllers

var Express = require("express");
const router = Express.Router();
var User = require("../models/user.model");

/* GET users listing. */
router.get("/", (req, res, next) => {
  User.find((err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
