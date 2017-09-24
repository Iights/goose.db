var mongoose = require('mongoose'),
  marked = require('marked')

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

modSchema.methods.convertReadmeMarkdown = function (readme) {
  return marked(readme)
}

module.exports = mongoose.model('Mod', modSchema)
