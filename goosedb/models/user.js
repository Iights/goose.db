var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  discord: String,
  joinDate: Date,
  lastOnline: Date,
  status: Number,
  rank: Number,
  bio: String,
  image: String,
  repository: String,
  paypal: String,
  favorites: Array,
  lists: Object
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);