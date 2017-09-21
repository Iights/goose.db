var model = require('../models');

module.exports = function(app, passport) {

  app.get('/login', (req, res) => {

  })

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/mods',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/register', (req, res) => {
    res.render('register', { title: 'Register', message: req.flash('registerMessage')});
  })

  app.post('/register', passport.authenticate('register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
  }))

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })

  app.get('/users', (req, res) => {
    res.render('users', { title: 'Userlist', message: req.flash('userlistMessage') });
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('user', { title: req.user.username, render: req.user, message: req.flash('profileMessage') });
  })

  app.get('/user', (req, res) => {
    if(req.user) res.redirect('/profile');
    else res.redirect('/users');
  })

  app.get('/user/:uid', (req, res) => {
    model.User.findOne({ _id: req.params.uid }, (err, user) => {
      if(err) throw err;
      if(!user) {
        req.flash('userlistMessage', 'Requested user could not be found or is banned.');
        res.redirect('/users');
      } else
        res.render('user', { title: user.username, render: user, message: req.flash('userMessage') });
    })
  })

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
  }
}