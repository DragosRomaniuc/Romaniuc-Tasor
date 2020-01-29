const { Account } = require('../../models'),
  // Wrapper middleware
  withAuthentication = require('../withAuthentication'),
  // Wrapped middleware
  authenticationOnCategory = (req, res, next) => {
    Account.findById(req.session.userId, 'userName')
      .populate('categories')
      .exec((err, account) => {
        // API error.
        if (err) return next(err);
        // No result.
        if (account == null) {
          return res.render('login', {
            account: req.body,
            errors: [{ msg: 'User not found' }]
          });
        }
        // Success - Account valid
        res.locals.account = account;
        next();
      });
  };

module.exports = withAuthentication(authenticationOnCategory);
