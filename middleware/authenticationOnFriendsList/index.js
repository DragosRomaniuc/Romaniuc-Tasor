const { Account } = require('../../models');
const withAuthentication = require('../withAuthentication');

const authenticationOnFriendsList = (req, res, next) => {
  Account.findById(req.session.userId, 'userName friendsList')
    .populate({
      path: 'friendsList',
      model: 'Friend',
      populate: {
        path: 'accounts',
        model: 'Account',
        match: { _id: { $ne: req.session.userId } },
        select: '_id userName'
      }
    })
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

module.exports = withAuthentication(authenticationOnFriendsList);
