var model = require('../models');

module.exports = function(app, passport) {

  /*
  app.get('/login', (req, res) => {
    if(req.user) res.redirect('/');
    else
      res.render('login', { title: 'Login', message: req.flash('loginMessage')});
  })
  */

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/mods',
    failureRedirect: '/mods',
    failureFlash: true
  }))

  app.get('/register', (req, res) => {
    if(req.user) res.redirect('/mods');
    else {
      res.render('register', { title: 'Register', message: req.flash('registerMessage')});
    }
  })

  app.post('/register', passport.authenticate('register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
  }))

  app.get('/logout', (req, res) => {
    req.logout();
    req.flash('modlistMessage', 'Logged out successfully.');
    res.redirect('/mods');
  })

  app.get('/users', (req, res) => {

    model.Rank.find({}, (err, ranks) => {
      if(err) throw err;
      model.User.find({}, (err, users) => {
        if(err) throw err;
        res.render('users', { title: 'Userlist', message: req.flash('userlistMessage'), list: users.sort((a, b) => {
          return a.rank - b.rank;
        }), ranks: ranks, user: req.user })
      })
    })
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('user', { title: req.user.username, render: req.user, message: req.flash('profileMessage'), user: req.user});
  })

  app.get('/user', (req, res) => {
    if(req.user) res.redirect('/profile');
    else res.redirect('/users');
  })

  app.get('/user/:uid', (req, res) => {
    model.User.findById(req.params.uid, { password: 0 }, (err, user) => {
      if(err || !user) {
        req.flash('userlistMessage', 'Requested user could not be found or is banned.');
        res.redirect('/users');
      } else
        res.render('user', { title: user.username, render: user, message: req.flash('userMessage'), user: req.user });
    })
  })

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/');
  }
}