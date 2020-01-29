const { Category } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  deleteCategory = ({ body: { _id } }, res, next) =>
    Category.findOne({ _id }, (err, foundCategory) =>
      // If find failed, render error page.
      // Else, remove category.
      err
        ? next(err)
        : foundCategory.remove(removeError =>
            removeError ? next(removeError) : res.send({ status: 'success' })
          )
    );

module.exports = withValidationErrorHandler(deleteCategory);
