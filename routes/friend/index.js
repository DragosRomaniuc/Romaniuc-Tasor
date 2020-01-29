// Dependencies
const express = require('express'),
    // Middleware
    {
        authenticationOnAccount
    } = require('../../middleware'),
    router = express.Router(),
    {
        allAccounts,
        assignCategory
    } = require('../../controllers').friendController;

// GET request for friends list.
/**
 *@route GET /friend
 * @group friend
 * @returns {object} 200 - List of all accounts
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/', authenticationOnAccount, allAccounts);

/**
 *@route GET /friend/addCategory
 * @group friend
 * @returns {object} 200 - Assigned a friend to a category
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/addCategory', authenticationOnAccount, assignCategory);

module.exports = router;
