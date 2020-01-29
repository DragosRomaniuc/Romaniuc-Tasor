const express = require('express'),
  router = express.Router(),
  // Middleware
  {
    authenticationOnAccount,
    validateUnAuthentication
  } = require('../middleware'),
  // Sub routes
  categoriesRouter = require('./categories'),
  subscribeRouter = require('./subscribe'),
  accountRouter = require('./account'),
  friendRouter = require('./friend'),
  {
    loginRouter,
    signUpRouter,
    validateRouter,
    logOutRouter,
    resetPasswordRouter
  } = require('./session');

// Home page
router.get('/', (req, res) =>
  res.redirect(req.app.locals.baseUrl + 'categories')
);

// Protected routes
router.use('/categories', categoriesRouter);
router.use('/subscribe', authenticationOnAccount, subscribeRouter);
router.use('/account', authenticationOnAccount, accountRouter);
router.use('/logout', authenticationOnAccount, logOutRouter);
router.use('/friend', friendRouter);

// Unprotected routes
router.use('/login', validateUnAuthentication, loginRouter);
router.use('/signup', validateUnAuthentication, signUpRouter);
router.use('/validate', validateRouter);
router.use('/reset-password', resetPasswordRouter);

module.exports = router;
