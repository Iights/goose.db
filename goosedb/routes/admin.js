var model = require('../models')

module.exports = function (app, passport, ranks) {
  app.get('/admin', hasAccess, (req, res) => {
    res.send('WIP')
  })

  app.get('/admin/users', hasAccess, (req, res) => {
    res.redirect('/admin/mods')
  })

  app.get('/admin/mods', hasAccess, (req, res) => {
    model.Mod.find({}, (err, mods) => {
      if (err) throw err
      res.render('dashboard_mods', { list: mods.sort((a, b) => {
        return a.revision - b.revision
      }) })
    })
  })

  app.post('/admin/mods/rev', [hasAccess, canRevMod], (req, res) => {
    model.Mod.findByIdAndUpdate(req.body.id, { $set: { revision: parseInt(req.body.rev) } }, (err, data) => {
      if (err) throw err
      console.log(data)
    })
  })

  function hasAccess (req, res, next) {
    if (req.user && ranks[req.user.rank].roles.indexOf('panelAccess') > -1) { return next() }
    res.redirect('/')
  }

  function canRevMod (req, res, next) {
    if (req.user && ranks[req.user.rank].roles.indexOf('revMod') > -1) { return next() }
    res.send('You don\'t have permission to do that')
  }
}
