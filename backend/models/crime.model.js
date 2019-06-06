var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const crimeSchema = new Schema({
  type: { type: String },
  geometry: {
    type: { type: String },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  properties: {
    id: { type: String },
    type: { type: String },
    year: { type: Number },
    address: { type: String },
    neighbourhood: { type: String }
  }
});

var Crime = mongoose.model("crimes", crimeSchema);

module.exports = Crime;
