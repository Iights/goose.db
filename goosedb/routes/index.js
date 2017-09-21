var model = require('../models');

module.exports = function(app, passport) {
  // Main page rendering handler
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  })

  // User and Profile rendering handler
  require('./user')(app, passport);

}