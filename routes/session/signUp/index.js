// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// GET request for sign up form.
/**
 *@route GET /signup
 * @group signup
 * @returns {object} 200 - request for sign up form.
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/', accountController.accountCreateGet);
/**
 *@route POST /signup
 * @group signup
 * @returns {object} 200 - request for sign up form.
 * @returns {Error}  404 - Invalid Page error
 */
// POST request for sign up form.
router.post('/', accountController.accountCreatePost);

module.exports = router;
