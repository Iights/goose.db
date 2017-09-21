var model = require('../models');

module.exports = function(app, passport) {
  app.get('/users', (req, res) => {
    res.render('users', { title: 'Userlist' });
  })

  app.get('/profile', (req, res) => {
    if(!req.user) res.render('error', { title: 'User not found', error: 'You are not logged in! '});
    else {
      res.render('user', { title: req.user.username, render: req.user });
    }
  })

  app.get('/user', (req, res) => {
    if(req.user) res.redirect('/profile');
    else res.redirect('/users');
  })

  app.get('/user/:uid', (req, res) => {
    model.User.findOne({ _id: req.params.uid }, (err, user) => {
      if(err) throw err;
      if(!user) res.render('error', { title: 'User Lookup Error', error: 'User with ID: ' + req.params.id + ' was not found in the database.'});
      else {
        res.render('user', { title: user.username, render: user });
      }
    })
  })
}