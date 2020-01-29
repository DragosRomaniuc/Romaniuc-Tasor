const withValidationErrorHandler = require('../withValidationErrorHandler');
const { Account } = require('../../models');

const loginHandler = (req, res, next, template) => {
  Account.findByEmail(req.body.email)
    .then(account => {
      // Account not validated yet.
      if (!account[0].validated)
        return res.render(template, {
          account: req.body,
          errors: [{ msg: 'Account email not validated.' }]
        });
      // User exist.
      // If password validation and update success, redirect to account page.
      // Else, send error.
      Account.validatePassword(
        account[0]._id,
        account[0].password,
        req.body.password,
        account[0].salt
      )
        .then(userId => {
          // Keep ID of updated account in session cookie for accessing routes.
          req.session.userId = userId;
          // Navigate to account page.
          res.redirect(req.app.locals.baseUrl + 'account');
        })
        .catch(msg => {
          console.log(msg);

          // API error.
          if (msg.status) return next(msg);
          // Password / Account related error.
          res.render(template, {
            account: req.body,
            errors: [{ msg }]
          });
        });
    })
    .catch(msg => {
      console.log(msg);

      // API error.
      if (msg.status) return next(msg);
      // Not found
      res.render(template, {
        account: req.body,
        errors: [{ msg }]
      });
    });
};

module.exports = withValidationErrorHandler(loginHandler);
