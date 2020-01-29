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
/**
 * @typedef Account
 * @property {string} email.required
 * * @property {string} userName.required
 * * @property {string} password.required
 * * @property {Boolean} validated
 * * @property {Array.ObjectID} Category
 * * @property {string} salt
 * * @property {Date} createdAt
 * * @property {Date} lastLogin
 */



/**
 * @typedef Category
 * @property {string} title.required
 * * @property {Array.ObjectID}.required Account
 * * @property {Array.ObjectID} Todo
 * * @property {Boolean} checked
 * * @property {Date} createdAt
 * * @property {Date} lastEdit
 */

/**
 * @typedef Todo
 * @property {string} title.required
 * * @property {Array.ObjectID}.required Category
 * * @property {Boolean} checked
 * * @property {Date} createdAt
 * * @property {Date} lastEdit
 * * @property {Boolean} public
 */


router.use('/login', validateUnAuthentication, loginRouter);
router.use('/signup', validateUnAuthentication, signUpRouter);
router.use('/validate', validateRouter);
router.use('/reset-password', resetPasswordRouter);

module.exports = router;
