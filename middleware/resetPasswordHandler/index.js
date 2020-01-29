// Middleware
const withValidationErrorHandler = require('../withValidationErrorHandler'),
  // Model
  { Account } = require('../../models');

const resetPasswordHandler = (req, res, next, template) => {
  // Data form is valid.
  Account.registerHashedPassword(req.params.id, req.body.password)
    .then(updatedUserId => {
      // Keep ID of updated account in session cookie for accessing routes.
      req.session.userId = updatedUserId;
      // Navigate to account page.
      res.redirect(req.app.locals.baseUrl + 'account');
    })
    .catch(msg => {
      // API error.
      console.error(msg);

      if (msg.status) return next(msg);
      // Password / Account related error.
      res.render(template, {
        account: req.body,
        errors: [{ msg }]
      });
    });
};

module.exports = withValidationErrorHandler(resetPasswordHandler);
