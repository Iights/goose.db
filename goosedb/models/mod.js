var mongoose = require('mongoose');

var modSchema = mongoose.Schema({
  name: String,
  type: String,
  version: String,
  paid: Boolean,
  author: {
    id: String,
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