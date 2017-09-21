var express = require('express'),
  app = express(),
  port = process.env.PORT || 80,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session');

var dbConfig = require('./config/database'),
  authConfig = require('./config/auth');

//mongoose.connect(dbConfig.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('views', __dirname + '/goosedb/templates');
app.use(express.static(__dirname + '/goosedb/static'));
app.set('view engine', 'pug');

app.use(session({ secret: authConfig.secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./goosedb/routes')(app, passport);

app.listen(port);
console.log('GooseDB Started on Port: ' + port);