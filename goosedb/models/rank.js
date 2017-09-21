var mongoose = require('mongoose')

var rankSchema = mongoose.Schema({
  id: Number,
  name: String,
  color: String,
  role: Number
})

module.exports = mongoose.model('Rank', rankSchema);