var mongoose = require('mongoose')

var issueSchema = mongoose.Schema({
  type: Number,
  title: String,
  bind: String,
  content: String,
  author: String,
  date: Date,
  status: Number
})