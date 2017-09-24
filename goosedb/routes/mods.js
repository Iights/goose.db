var model = require('../models'),
  url = require('url'),
  request = require('request')

module.exports = function (app, passport, ranks) {
  // TODO Sorting
  // Modlist render handling
  app.get('/mods', (req, res) => {
    var options = {
      revision: { $gt: 0 }
    }

    if (req.query.t && req.query.t !== 'all') { options['$where'] = "this.type.toLowerCase() === '" + req.query.t + "'" }

    if (req.user && ranks[req.user.rank].roles.indexOf('viewUnreviewed') > -1) {
      delete options['revision']
    }
    process.nextTick(() => {
      model.Mod.find(options, (err, list) => {
        if (err) throw err
        res.render('mods', { title: 'Modlist', list: list, message: req.flash('modlistMessage'), query: req.query, user: req.user, ranks: ranks})
      })
    })
  })

  // Mod submission handling
  app.post('/mods/add', (req, res) => {
    if (!req.user) {
      req.flash('modlistMessage', 'You\'re not logged in.')
      res.redirect('/mods')
    } else {
      if (ranks[req.user.rank].roles.indexOf('addMod') > -1) {
        model.Mod.find({ name: req.body.name }, (err, mods) => {
          if (err) throw err
          if (mods.length > 0) {
            req.flash('modMessage', 'This module already exists in the database')
            res.redirect('/mod/' + mods[0]._id)
          } else {
            var mod = new model.Mod()
            mod.name = req.body.name
            mod.type = req.body.type
            mod.version = req.body.version
            mod.paid = (req.body.paid === 'true')
            mod.author = {
              id: req.user._id,
              name: req.user.username,
              email: req.user.email,
              discord: req.user.discord,
              paypal: req.user.paypal || req.body.paypal
            },
            mod.image = req.body.image
            mod.body = req.body.readme || (req.body.repository.includes('github') ? 'https://raw.githubusercontent.com/' + req.body.repository.split('.com/')[1] + '/master/README.md' : '')
            mod.download = req.body.download || (req.body.repository.includes('github') ? req.body.repository + '/archive/master.zip' : '')
            mod.repository = req.body.repository
            mod.revision = ranks[req.user.rank].roles.indexOf('revMod') > -1 ? 1 : 0
            mod.tags = req.body.tags.trim().split(',')

            process.nextTick(() => mod.save((err) => {
              if (err) throw err
              model.Mod.findOne({ name: mod.name }, (err, ret) => {
                if (err) throw err
                if (ret.revision > 0) {
                  req.flash('modMessage', 'Your mod was submitted')
                } else {
                  req.flash('modMessage', 'Your mod was submitted to the database and is waiting for approval/revision by the Moderators')
                }
                res.redirect('/mod/' + ret._id)
              })
            }))
          }
        })
      } else {
        req.flash('modlistMessage', 'You\'re not allowed to submit modules, ask a Moderator for help.')
        res.redirect('/mods')
      }
    }
  })

  app.get('/mod', (req, res) => {
    res.redirect('/mods')
  })

  app.get('/mod/:modid', (req, res) => {
    if (req.params.uid.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)) {
      model.Mod.findById(req.params.modid, (err, mod) => {
        if (err) throw err
        if (!mod) {
          req.flash('modlistMessage', 'The mod with ID:' + req.params.modid + ' was not found in database')
          res.redirect('/mods')
        } else {
          if (mod.revision < 1 && (!req.user || req.user.username !== mod.author.name)) {
            req.flash('modlistMessage', 'This mod is currently under revision or recently submitted, please contact a Moderator if you think this is an error.')
            res.redirect('/mods')
          } else {
            request(mod.body, (err, data) => {
              if (err || !data) {
                req.flash('modMessage', 'Could not retreive README data, due to an internal error.')
                res.render('mod', { title: mod.name, mod: mod, message: req.flash('modMessage'), user: req.user, ranks: ranks })
              } else {
                res.render('mod', { title: mod.name,
                  mod: mod,
                  message: req.flash('modMessage'),
                  user: req.user,
                  ranks: ranks,
                  body: mod.convertReadmeMarkdown(data.body).replace('<table>', '<table class="table table-striped table-markdown">') })
              }
            })
          }
        }
      })
    } else {
      res.redirect('/')
    }
  })
}
