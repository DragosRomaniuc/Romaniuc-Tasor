const { Account } = require('../../models');

module.exports = wrappedFunction => (req, res, next, template = '') =>
  Account.findByEmail(req.body.email)
    .then(foundAccount => {
      // If account not validated yet, send error.
      // Else, pass account to wrapped function.
      if (!foundAccount[0].validated) {
        const error = {
          account: req.body,
          errors: [{ msg: 'Account email not validated.' }]
        };
        // If email requested for a page access, render page with error.
        // Else, this is an API request so respond error.
        return template ? res.render(template, error) : res.send(error);
      }
      wrappedFunction(req, res, next, foundAccount[0], template);
    })
    .catch(msg => {
      // API error.
      if (msg.status) return next(msg);
      // Account not found error.
      const error = {
        account: req.body,
        errors: [{ msg }]
      };
      // If email requested for a page access, render page with error.
      // Else, this is an API request so respond error.
      template ? res.render(template, error) : res.send(error);
    });
