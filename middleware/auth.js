require('dotenv').config();

module.exports = {
    ensureLogin: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/')
      }
    },
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    },
    ensureAdmin: function (req, res, next) {
      if (req.user.googleID==process.env.GOOGLE_ADMIN_ID) {
        return next();
      } else {
        res.redirect('/');
      }
    }
}
