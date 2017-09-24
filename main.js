var express = require('express'),
  app = express(),
  port = process.env.PORT || 80,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  sanitizer = require('express-sanitized'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  helmet = require('helmet'),
  csrf = require('csurf')

var dbConfig = require('./config/database'),
  authConfig = require('./config/auth')

var model = require('./goosedb/models')

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer())
app.use(helmet())

require('./config/passport')(passport)

app.set('views', __dirname + '/goosedb/templates')
app.use(express.static(__dirname + '/goosedb/static'))
app.set('view engine', 'pug')

app.use(session({ secret: authConfig.secret }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(csrf())
app.use(function (req, res, next) {
  res.locals.csrftoken = req.csrfToken()
  next()
})

require('./goosedb/routes')(app, passport)

app.listen(port)
console.log('GooseDB Started on Port: ' + port)
