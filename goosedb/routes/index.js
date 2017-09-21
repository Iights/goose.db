module.exports = function(app, passport) {
  app.get('/', (req, res) => {
    res.render('index', { title: 'Home'});
  })
}