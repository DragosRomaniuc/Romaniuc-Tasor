const { Todo } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  deleteTodo = ({ body: { _id } }, res, next) =>
    Todo.findOne({ _id }, (findErr, foundTodo) =>
      // If find failed, render error page.
      // Else, remove todo.
      findErr
        ? next(findErr)
        : foundTodo.remove(removeErr =>
            // If remove failed, render error page.
            // Else, respond success.
            removeErr ? next(removeErr) : res.send({ status: 'success' })
          )
    );

module.exports = withValidationErrorHandler(deleteTodo);
