var express = require('express'),
  app = express(),
  port = process.env.PORT || 80,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  helmet = require('helmet'),
  lusca = require('lusca')

var dbConfig = require('./config/database'),
  authConfig = require('./config/auth')

var model = require('./goosedb/models')

mongoose.connect(dbConfig.url)

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())
app.use(helmet())

app.set('views', __dirname + '/goosedb/templates')
app.use(express.static(__dirname + '/goosedb/static'))
app.set('view engine', 'pug')

app.use(session({ secret: authConfig.secret }))
app.use(lusca({
  csrf: true,
  csp: { 
    'default-src': '\'self\'',
    'img-src': '*'
   },
  xframe: "SAMEORIGIN",
  p3p: "ABCDEF",
  hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./goosedb/routes')(app, passport)

app.listen(port)
console.log('GooseDB Started on Port: ' + port)
