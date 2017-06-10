const { User } = require('./models')
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({where: {email}})
        .then(function (user) {
            if (!user || !user.checkPassword(password)) {
                return done(null)
            }
            return done(null, user)
        })
        .catch(function (error) {
            return done(error)
        })
}))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

module.exports = passport
