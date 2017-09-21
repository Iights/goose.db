var mongoose = require('mongoose');

var modSchema = mongoose.Schema({
  name: String,
  type: Number,
  version: String,
  paid: Boolean,
  author: {
    name: String,
    email: String,
    discord: String,
    paypal: String
  },
  image: String,
  body: String,
  download: String,
  repository: String,
  revision: Number,
  tags: Array
})

module.exports = mongoose.model('Mod', modSchema);