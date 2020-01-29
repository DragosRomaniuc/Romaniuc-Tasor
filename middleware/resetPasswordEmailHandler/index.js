// Middleware
const withValidationErrorHandler = require('../withValidationErrorHandler');
// Model
const { Account } = require('../../models');
// Helpers
const { sendEmail, getUrl } = require('../../utility');

const resetPasswordEmailHandler = (req, res, next, template) => {
  const { email } = req.body;
  Account.findByEmail(email)
    .then(account => {
      // Successful - Account exist. Send password reset email.
      const url = getUrl(req);
      const verifyLink = url + '/reset-password/' + account[0]._id;
      sendEmail(
        'passwordReset', // Email template.
        email, // Receiver email.
        'Reset Password', // Email subject.
        account[0].userName,
        verifyLink,
        url // Base url for image src of email template
      )
        .then(() =>
          // Email sent success.
          res.render(template, {
            message:
              'The email has been sent! Please do not forget to check your junk/spam folders also.'
          })
        )
        .catch(error => {
          console.error(error);

          // Email sent failed.
          res.render(template, {
            email,
            errors: [{ msg: 'Failed on mail send' }]
          });
        });
    })
    .catch(msg => {
      // API error.
      if (msg.status) return next(msg);
      // Account not found
      res.render(template, {
        email,
        errors: [{ msg }]
      });
    });
};

module.exports = withValidationErrorHandler(resetPasswordEmailHandler);
