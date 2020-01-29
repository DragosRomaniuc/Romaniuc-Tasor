const { Category, Todo } = require('../../../models'),
  // Wrapper middleware
  withValidationErrorHandler = require('../../withValidationErrorHandler'),
  // Wrapped middleware
  createTodo = ({ params: { id: category }, body: { title } }, res, next) =>
    new Todo({
      title,
      category
    }).save((
      saveErr,
      { _id, title } // If save failed, render error page.
    ) =>
      // Else, register saved todo ID on related category list.
      saveErr
        ? next(saveErr)
        : Category.updateOne(
            { _id: category },
            { $push: { todoList: _id } },
            // If todo ID register succeed, respond created todo.
            // Else, render error.
            updateErr =>
              updateErr ? next(updateErr) : res.send({ _id, title })
          )
    );

module.exports = withValidationErrorHandler(createTodo);
