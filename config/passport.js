var Strategy = require('passport-local').Strategy,
  User = require('../goosedb/models').User;

module.exports = function(passport) {
  passport.serializeUser((user, callback) => {
    callback(null, user._id);
  });

  passport.deserializeUser((id, callback) => {
    User.findById(id, (err, user) => {
      callback(err, user);
    })
  })

  passport.use('register', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, callback) => {
    process.nextTick(() => {
      if(username.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)) {
        User.findOne({ username: username }, (err, data) => {
          if(err) return callback(err);
          if(data) return callback(null, false, req.flash('registerMessage', 'User already exists in the database'));
          else {
            var user = new User();
            user.username = username;
            user.email = req.body.email;
            user.password = user.generateHash(password);
            user.discord = req.body.discord;
            user.joinDate = new Date(Date.now());
            user.rank = 4;
            user.lastOnline = new Date(Date.now());
            user.bio = req.body.bio;
            user.image = req.body.image;
            user.repository = req.body.repository;
            user.paypal = req.body.paypal;
            user.status = 1;

            user.save((err) => {
              if(err) {
                console.log('HERE')
                callback(err);
              }
              return callback(null, user);
            })
          }
        })
      } else 
          return callback(null, false, req.flash('registerMessage', 'Username does not match alphanumerical patter. (Yes I have serverside checks unlike TERA)'))
    })
  }))

  passport.use('login', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, callback) {
    User.findOneAndUpdate({ username: username }, { lastOnline: new Date(Date.now()), status: 1 }, (err, user) => {
      if(err) return callback(err);
      if(!user) return callback(null, false, req.flash('modlistMessage', 'User not found.'));
      if(!user.validPassword(password)) return callback(null, false, req.flash('modlistMessage', 'Wrong credentials.'));
      return callback(null, user);
    })
  }))
}