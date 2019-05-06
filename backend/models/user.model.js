const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: { type: Number },
  name: { type: String }
});

var User = mongoose.model("Users", userSchema);

module.exports = User;
