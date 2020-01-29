const { Account } = require('../../models'),
  withAuthentication = require('../withAuthentication');

const authenticationOnAccount = (
  {
    session,
    app: {
      locals: { baseUrl }
    }
  },
  res,
  next
) => {
  Account.findById(session.userId).exec((err, account) => {
    // API error.
    if (err) return next(err);
    // Account does not exist.
    if (account == null) res.redirect(baseUrl + 'login');

    // Success - Account valid
    res.locals.account = account;
    next();
  });
};

module.exports = withAuthentication(authenticationOnAccount);
