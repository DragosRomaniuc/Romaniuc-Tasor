const { each } = require('async');

module.exports = ({ model }) =>
  function(next) {
    const { _id, accounts } = this,
      Account = model('Account');
    each(
      // Accounts list to loop.
      accounts,
      // Remove category's ref on each account.
      (accountId, callBack) =>
        Account.findByIdAndUpdate(
          accountId,
          {
            $pull: { categories: _id }
          },
          callBack
        ),
      // If category's ref delete succeed, keep process.
      // Else, render error.
      err => (err ? next(err) : next())
    );
  };
