const { Account } = require('../../models'),
  // Wrapper middleware
  withAuthentication = require('../withAuthentication'),
  // Wrapped middleware
  authenticationOnCategory = (
    { session: { userId }, params: { id: _id }, body },
    res,
    next
  ) =>
    Account.findById(userId, 'userName')
      .populate({
        path: 'categories',
        match: { _id },
        model: 'Category',
        populate: {
          path: 'todoList',
          model: 'Todo'
        }
      })
      .exec((err, account) => {
        // API error.
        if (err) return next(err);
        // No result.
        if (account == null) {
          return res.render('login', {
            account: body,
            errors: [{ msg: 'User not found' }]
          });
        }
        // Success - Account valid
        res.locals.account = account;
        next();
      });

module.exports = withAuthentication(authenticationOnCategory);
