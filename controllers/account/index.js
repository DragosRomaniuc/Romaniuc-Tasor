// Dependencies
const { body } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter');

// Middleware
const {
  loginHandler,
  signUpHandler,
  validationHandler,
  resetPasswordEmailHandler,
  logOutHandler,
  resetPasswordHandler,
  accountDeleteHandler
} = require('../../middleware');

// Helper
const checkPasswordsMatch = require('../../utility/checkPasswordsMatch');

// Display account details.
exports.accountDetails = (req, res, next) => {
  const {
    email,
    userName,
    createdAtFormatted,
    lastLoginFormatted
  } = res.locals.account;

  res.render('account', {
    account: {
      email,
      name: userName,
      Created: createdAtFormatted,
      'Last Login': lastLoginFormatted
    }
  });
};

// Display account login form on GET.
exports.accountLoginGet = (req, res, next) => res.render('login');

// Handle account login on POST.
exports.accountLoginPost = [
  // Validate fields.
  body('email')
    .isEmail()
    .isLength({ min: 4, max: 100 })
    .withMessage('Email address must be between 4-100 characters long.')
    .normalizeEmail()
    .withMessage('Email must be specified'),
  body('password')
    .isLength({ min: 5, max: 100 })
    .withMessage('Password must be at least 5 chars long'),
  // Sanitize fields.
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),

  // Process request after validation and sanitization.
  (...args) => loginHandler(...args, 'login')
];

// Handle account log out on POST.
exports.accountLogOutPost = logOutHandler;

// Display account create form on GET.
exports.accountCreateGet = (req, res, next) => res.render('signup');

// Handle account create on POST.
exports.accountCreatePost = [
  // Validate fields.
  body('email')
    .isEmail()
    .isLength({ min: 4, max: 100 })
    .withMessage('Email address must be between 4-100 characters long.')
    .normalizeEmail()
    .withMessage('Email must be specified'),
  body('password')
    .isLength({ min: 5, max: 100 })
    .withMessage('Password must be at least 5 chars long')
    .custom(checkPasswordsMatch),
  body('userName')
    .isLength({ min: 1, max: 100 })
    .trim()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  // Sanitize fields.
  sanitizeBody('email').escape(),
  sanitizeBody('password').escape(),
  sanitizeBody('userName').escape(),

  // Process request after validation and sanitization.
  (...args) => signUpHandler(...args, 'signup')
];

// Handle account validation on GET.
exports.accountValidateGet = validationHandler;

// Display email form for reset password on GET.
exports.resetPasswordEmailGet = (req, res, next) =>
  res.render('passwordResetEmailForm');

// Handle email form for reset password on POST.
exports.resetPasswordEmailPost = [
  // Validate field.
  body('email')
    .isEmail()
    .isLength({ min: 4, max: 100 })
    .withMessage('Email address must be between 4-100 characters long.')
    .normalizeEmail()
    .withMessage('Email must be specified'),

  // Sanitize field.
  sanitizeBody('email').escape(),

  // Process request after validation and sanitization.
  (...args) => resetPasswordEmailHandler(...args, 'passwordResetEmailForm')
];

// Display create new password form on GET.
exports.resetPasswordGet = (req, res, next) => res.render('passwordResetForm');

// Handle create new password on POST.
exports.resetPasswordEmailPut = [
  // Validate fields.
  body('password')
    .isLength({ min: 5, max: 100 })
    .withMessage('Password must be at least 5 chars long')
    .custom(checkPasswordsMatch),
  sanitizeBody('password').escape(),

  // Process request after validation and sanitization.
  (...args) => resetPasswordHandler(...args, 'passwordResetForm')
];

// Handle account delete on DELETE.
exports.accountDelete = accountDeleteHandler;
