var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
  type: Number,
  from: String,
  to: String,
  content: String,
  read: Boolean
})

module.exports = mongoose.model('Message', messageSchema)
