// Model
const { Account } = require('../../models');

module.exports = (req, res, next) => {
  Account.findByIdAndUpdate(req.params.id, {
    lastLogin: new Date(),
    validated: true
  }).exec((err, updatedUser) => {
    // API error.
    if (err) return next(err);
    // No result.
    if (updatedUser == null) {
      return next({
        status: 404,
        message:
          'Account not found or validation token expired. Please sign up again.'
      });
    }

    // Keep updated account id in session cookie for later uses.
    req.session.userId = updatedUser._id;
    // Navigate to account page.
    res.redirect(req.app.locals.baseUrl + 'account');
  });
};
