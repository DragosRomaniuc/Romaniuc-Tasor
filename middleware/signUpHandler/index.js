// Middleware
const withValidationErrorHandler = require('../withValidationErrorHandler');
// Model
const { Account } = require('../../models');
// Helpers
const { sendEmail, getUrl } = require('../../utility');

const signUpHandler = (req, res, next, template) => {
  Account.isExistByEmail(req.body.email)
    .then(() =>
      // Account already exist
      res.render(template, {
        account: req.body,
        errors: [{ msg: 'Account already exist.' }]
      })
    )
    .catch(msg => {
      // API error.
      if (msg.status) return next(msg);
      // Success - This is a new account.
      const { email, userName, password } = req.body;
      // Create an account object with trimmed and escaped data.
      const newAccount = new Account({
        email,
        userName,
        password
      });
      newAccount.save((err, createdAcc) => {
        // API error.
        if (err) return next(err);
        // Successful - Send validation email.
        const url = getUrl(req);
        const verifyLink = url + '/validate/' + createdAcc._id;
        sendEmail(
          'signUp', // Email template.
          email, // Receiver email.
          'Email Validation', // Email subject.
          userName,
          verifyLink,
          url // Base url for image src of email template
        )
          .then(() => {
            // Email sent success.
            res.render('feedback', {
              message: `Thank you for interested in using my To-Do application.  A confirmation email has been sent to ${email}. Please confirm your email before starting to use the application.`
            });
          })
          .catch(error => {
            console.error(error);

            // Email sent failed.
            return res.render(template, {
              email,
              errors: [{ msg: 'Failed on sending confirmation e-mail.' }]
            });
          });
      });
    });
};

module.exports = withValidationErrorHandler(signUpHandler);
