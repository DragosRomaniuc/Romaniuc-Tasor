// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');
/**
 *@route POST /session
 * @group sesssion
 * @returns {object} 200 - request for login form.
 * @returns {Error}  404 - Invalid Page error
 */
// POST request for login form.
router.post('/', accountController.accountLogOutPost);

module.exports = router;
