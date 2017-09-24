var model = require('../models');

module.exports = function(app, passport) {

  var ranks = require('../../setup/ranks.json');

  // Main page rendering handler
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home', ranks: ranks, user: req.user });
  })

  app.get('/about', (req, res) => {
    res.render('about', { title: 'About', ranks: ranks, user: req.user})
  })

  // Admin panel request handler
  require('./admin')(app, passport, ranks);

  // User and Profile rendering handler
  require('./users')(app, passport, ranks);

  // Mod and modlist rendering handler
  require('./mods')(app, passport, ranks);

}