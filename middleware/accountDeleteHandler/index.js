// Model
const { Account } = require('../../models');

// Helper
const logOutHandler = require('../logOutHandler');

module.exports = (req, res, next) => {
  Account.findOne({ _id: req.session.userId }, (err, foundAcc) => {
    // API error.
    if (err) return next(err);
    // If delete success, destroy session.
    foundAcc.remove(error =>
      error ? next(error) : logOutHandler(req, res, next)
    );
  });
};
