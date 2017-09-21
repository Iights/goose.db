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
  authConfig = require('./config/auth'),
  ranksConfig = require('./setup/ranks.json');

var model = require('./goosedb/models');

mongoose.connect(dbConfig.url);

// TODO move setup and db stuff to external files.
/*
model.Rank.find({}, (err, data) => {
  if(err) throw err;
  for(let rank in ranksConfig) {
    if(!(ranksConfig[rank] in data)) {
      var rnk = model.Rank();
      rnk.id = ranksConfig[rank].id;
      rnk.name = ranksConfig[rank].name;
      rnk.color = ranksConfig[rank].color;
      rnk.roles = ranksConfig[rank].roles;

      rnk.save((err) => { if(err) throw err; });
    }

  }
});
*/

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