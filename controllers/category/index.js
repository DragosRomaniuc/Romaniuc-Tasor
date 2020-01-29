// Validators
const { body } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter'),
  // Middleware
  {
    renderCategoryList,
    createCategory,
    updateCategory,
    deleteCategory
  } = require('../../middleware/categoryHandlers');

// Display category list.
exports.categoriesList = renderCategoryList;

// Handle category create on POST.
exports.newCategory = [
  // Validate category.
  body('title')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Title must be specified.'),
  // Sanitize title.
  sanitizeBody('title').escape(),
  createCategory
];

// Handle category update on PUT.
exports.editCategory = [
  // Validate category.
  body('item')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Updated item must be specified.'),
  body('_id')
    .isLength({ min: 1, max: 100 })
    .trim()
    .isMongoId()
    .withMessage('Id must be specified.'),
  // Sanitize category.
  sanitizeBody('item').escape(),
  sanitizeBody('_id').escape(),
  (req, res, next) => updateCategory(req, res, next)
];

// Handle category delete on DELETE.
exports.deleteCategory = [
  // Validate id.
  body('_id')
    .isLength({ min: 1, max: 100 })
    .trim()
    .isMongoId()
    .withMessage('Id must be specified.'),
  // Sanitize id.
  sanitizeBody('_id').escape(),
  (req, res, next) => deleteCategory(req, res, next)
];
