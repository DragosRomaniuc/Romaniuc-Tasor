// Dependencies
const express = require('express'),
  router = express.Router(),
  // Middleware
  {
    authenticationOnCategory,
    authenticationOnTodo,
    authenticationOnTodoDetail,
    authenticationOnAccount
  } = require('../../middleware'),
  // Category controllers.
  {
    categoriesList,
    newCategory,
    editCategory,
    deleteCategory
  } = require('../../controllers').categoriesController,
  // To-do controllers.
  {
    todoList,
    todoDetail,
    newTodo,
    editTodo,
    deleteTodo
  } = require('../../controllers').todosController,
  // Base URL for to-do routes.
  todoBaseUrl = '/:id/todos';

/*
 ** CATEGORY ROUTES
 */

// GET request for categories list.
router.get('/', authenticationOnCategory, categoriesList);

// POST request for creating a new category.
router.post('/new', authenticationOnAccount, newCategory);

// To-Do list page
router.get('/:id', authenticationOnAccount, (req, res) =>
  res.redirect(
    req.app.locals.baseUrl + 'categories/' + req.params.id + '/todos'
  )
);

// PUT request for updating a category.
router.put('/edit', authenticationOnAccount, editCategory);

// DELETE request for deleting a category.
router.delete('/delete', authenticationOnAccount, deleteCategory);

/*
 ** TO-DO ROUTES
 */

/** To-Do list page. **/

// GET request for todo list.
router.get(todoBaseUrl, authenticationOnTodo, todoList);

// POST request for creating a todo in todo list page.
router.post(`${todoBaseUrl}/new`, authenticationOnAccount, newTodo);

// PUT request for updating a todo in todo list page.
router.put(`${todoBaseUrl}/edit`, authenticationOnAccount, editTodo);

// DELETE request for deleting a todo in todo list page.
router.delete(`${todoBaseUrl}/delete`, authenticationOnAccount, deleteTodo);

/** To-Do detail page. **/

// GET request for todo detail.
router.get(`${todoBaseUrl}/:todoId`, authenticationOnTodoDetail, todoDetail);

// PUT request for updating a todo.
router.put(`${todoBaseUrl}/:todoId/edit`, authenticationOnAccount, editTodo);

// DELETE request for deleting a todo.
router.delete(
  `${todoBaseUrl}/:todoId/delete`,
  authenticationOnAccount,
  deleteTodo
);

module.exports = router;
