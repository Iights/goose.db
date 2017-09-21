var model = require('../models'),
  url = require('url')

module.exports = function(app, passport) {

  // TODO Sorting
  // Modlist render handling
  app.get('/mods', (req, res) => {
    if(!req.query) res.render('mods', { title: "Modlist" });
    else {
      if(req.query.e) {
        switch(req.query.e) {
          case '1':
            res.render('mods', { title: "Modlist", error: "The mod you're searching for is not revised by a Moderator yet" });
          default:
            res.render('mods', { title: "Modlist" });
        }
      } else if(req.query.s) {
        // SORT HERE
      } else
        res.render('mods', { title: "Modlist" });
    }
  })

  app.get('/mod', (req, res) => {
    res.redirect('/mods');
  })

  app.get('/mod/:modid', (req, res) => {
    model.Mod.findOne({ _id: req.params.modid }, (err, mod) => {
      if(err) throw err;
      if(!mod) res.render('error', { title: "Mod not found", error: "The requested mod was not found on the database" });
      else {
        if(mod.revision < 1 && (!req.user || req.user.username !== mod.author.name)) 
          res.redirect(url.format({
            pathname: '/mods',
            query: {
              'e' : '1'
            }
          }));
        else {
          res.render('mod', { title: mod.name, mod: mod });
        }
      }
    })
  })
}