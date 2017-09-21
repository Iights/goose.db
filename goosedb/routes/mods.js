var model = require('../models'),
  url = require('url')

module.exports = function(app, passport) {

  // TODO Sorting
  // Modlist render handling
  app.get('/mods', (req, res) => {
    res.render('mods', { title: 'Modlist', message: req.flash('modlistMessage')});
  })

  app.post('/mods/add', (req, res) => {
    if(!req.user || req.user.rank < 3) {
      req.flash('modlistMessage', 'You\'re not logged in or not allowed to submit mods.');
      res.redirect('/mods');
    } else {
      model.Mod.find({ name: req.body.name }, (err, mods) => {
        if(err) throw err;
        if(mods.length > 0) {
          req.flash('modMessage', 'This module already exists in the database');
          res.redirect('/mod/'+mods[0]._id);
        } else {
          var mod = new model.Mod();
          mod.name = req.body.name;
          mod.type = req.body.type;
          mod.version = req.body.version;
          mod.paid = (req.body.paid === 'true');
          mod.author = {
            name: req.user.username,
            email: req.user.email,
            discord: req.user.discord,
            paypal: req.user.paypal || req.body.paypal
          },
          mod.image = req.body.image;
          mod.body = req.body.readme;
          mod.download = req.body.download;
          mod.repository = req.body.repository;
          mod.revision = (req.user.rank > 3 ? 1 : 0);
          mod.tags = req.body.tags.trim().split(',');

          process.nextTick(() => mod.save((err) => {
            if(err) throw err;
          }))
        }
      })
    }
  })

  app.get('/mod', (req, res) => {
    res.redirect('/mods');
  })

  app.get('/mod/:modid', (req, res) => {
    model.Mod.findById(req.params.modid, (err, mod) => {
      if(err) throw err;
      if(!mod) {
        req.flash('modlistMessage', 'The mod with ID:'+req.params.modid+' was not found in database');
        res.redirect('/mods');
      } else {
        if(mod.revision < 1 && (!req.user || req.user.username !== mod.author.name)) {
          req.flash('modlistMessage', 'This mod is currently under revision or recently submitted, please contact a Moderator if you think this is an error.');
          res.redirect('/mods');
        } else {
          res.render('mod', { title: mod.name, mod: mod, message: req.flash('modMessage') });
        }
      }
    })
  })
}