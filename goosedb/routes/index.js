module.exports = function(app, passport) {
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  })

  // User and profile rendering
  require('./user')(app, passport);
}