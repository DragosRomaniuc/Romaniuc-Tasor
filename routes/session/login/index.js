// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');
/**
 *@route GET /login
 * @group login
 * @returns {object} 200 - request VIEW for login form.
 * @returns {Error}  404 - Invalid Page error
 */
// GET request for login form.
router.get('/', accountController.accountLoginGet);
/**
 *@route POST /login
 * @group login
 * @returns {object} 200 - request for login form.
 * @returns {Error}  404 - Invalid Page error
 */
// POST request for login form.
router.post('/', accountController.accountLoginPost);

module.exports = router;
