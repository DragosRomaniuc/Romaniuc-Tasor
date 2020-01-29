const { Account, Category } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  createCategory = ({ body: { title }, session: { userId } }, res, next) =>
    new Category({
      title,
      accounts: [userId]
    }).save((err, { _id, title }) =>
      // If save failed, render error page.
      // Else, register saved category ID on related account.
      err
        ? next(err)
        : Account.updateOne(
            { _id: userId },
            { $push: { categories: _id } },
            // If category register succeed, respond created category.
            // Else, render error.
            err => (err ? next(err) : res.send({ _id, title }))
          )
    );

module.exports = withValidationErrorHandler(createCategory);
