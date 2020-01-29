const { Account } = require('../../models');

module.exports = (
  {
    session,
    app: {
      locals: { baseUrl }
    }
  },
  res,
  next
) => {
  // If session or account does not exist, navigate to login/sign up page.
  // Else, redirect to home page.
  if (!session.userId) return next();

  Account.findById(session.userId).exec((err, account) => {
    // API error.
    if (err) return next(err);
    // Account does not exist.
    if (account == null) return next();
    // Account already exist and logged in!
    res.redirect(baseUrl);
  });
};
