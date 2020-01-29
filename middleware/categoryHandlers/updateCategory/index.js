const { Category } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  updateCategory = ({ body: { _id, item } }, res, next) =>
    Category.updateOne({ _id }, { ...item }, err =>
      // If update failed, render error page.
      // Else, respond category back.
      err ? next(err) : res.send({ ...item, _id })
    );

module.exports = withValidationErrorHandler(updateCategory);
