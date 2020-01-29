const { parallel, each } = require('async');
module.exports = connection => {
  return function(next) {
    // Account
    const self = this,
      // Models
      Account = connection.model('Account'),
      InviteFriend = connection.model('InviteFriend'),
      Category = connection.model('Category'),
      Friend = connection.model('Friend');

    parallel(
      {
        // Remove related invites / requests to this account.
        removeInvites: callBack =>
          each(
            self.friendInvList,
            (_id, callBackEach) =>
              InviteFriend.findOne({ _id }, (err, foundModel) => {
                if (err) next(err);
                if (foundModel == null) return next('Can not delete account.');
                foundModel.remove(callBackEach);
              }),
            callBack // Parallel's callback.
          ),
        // Remove all friendships.
        removeFriends: callBack =>
          Friend.deleteMany({ accounts: { $in: [self._id] } }, callBack),
        // Remove all to-dos within categories.
        removeCategories: callBack =>
          Category.deleteMany({ accounts: { $in: [self._id] } }, callBack)
      },
      // If any of the above handlers gives error, stop execution.
      // Else, keep following the process.
      error => (error ? next(error) : next())
    );
  };
};
