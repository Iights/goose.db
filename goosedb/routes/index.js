var model = require('../models');

module.exports = function(app, passport) {
  // Main page rendering handler
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  })

  app.get('/about', (req, res) => {
    res.render('about', { title: 'About'})
  })

  // User and Profile rendering handler
  require('./users')(app, passport);

  // Mod and modlist rendering handler
  require('./mods')(app, passport);

}