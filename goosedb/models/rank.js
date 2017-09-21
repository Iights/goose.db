var mongoose = require('mongoose')

var rankSchema = mongoose.Schema({
  id: Number,
  name: String,
  color: String,
  roles: Array
})

module.exports = mongoose.model('Rank', rankSchema);