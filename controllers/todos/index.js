// Validators
const { body } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter'),
  // Middleware
  {
    renderTodoList,
    renderTodo,
    createTodo,
    updateTodo,
    deleteTodo
  } = require('../../middleware/todoHandlers');

// Display todo list.
exports.todoList = renderTodoList;

// Display todo details.
exports.todoDetail = renderTodo;

// Handle todo create on POST.
exports.newTodo = [
  // Validate title.
  body('title')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Title must be specified.'),
  // Sanitize title.
  sanitizeBody('title').escape(),
  createTodo
];

// Handle todo update on PUT.
exports.editTodo = [
  // Validate title.
  body('item')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Todo must be specified.'),
  body('_id')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Id must be specified.'),
  // Sanitize title.
  sanitizeBody('item').escape(),
  sanitizeBody('_id').escape(),
  updateTodo
];

// Handle todo delete on DELETE.
exports.deleteTodo = [
  // Validate id.
  body('_id')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Id must be specified.'),
  // Sanitize id.
  sanitizeBody('_id').escape(),
  deleteTodo
];
