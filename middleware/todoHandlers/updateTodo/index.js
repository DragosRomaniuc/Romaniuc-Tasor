const { Todo } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  updateTodo = ({ body: { _id, item } }, res, next) =>
    Todo.updateOne({ _id }, { ...item }, updateErr =>
      // If update failed, render error page.
      // Else, respond todo back.
      updateErr ? next(updateErr) : res.send({ _id, ...item })
    );

module.exports = withValidationErrorHandler(updateTodo);
