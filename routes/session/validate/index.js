// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');
/**
 *@route GET validate/:id
 * @group validate
 * @returns {object} 200 - request for sign up form.
 * @returns {Error}  404 - Invalid Page error
 */
// GET request for sign up form.
router.get('/:id', accountController.accountValidateGet);

module.exports = router;
