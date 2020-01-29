// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');
/**
 *@route GET /reset-password
 * @group reset-password
 * @returns {object} 200 - request for email form
 * @returns {Error}  404 - Invalid Page error
 */
// GET request for email form.
router.get('/', accountController.resetPasswordEmailGet);
/**
 *@route POST /reset-password
 * @group reset-password
 * @returns {object} 200 - request for email form
 * @returns {Error}  404 - Invalid Page error
 */
// POST request for email form.
router.post('/', accountController.resetPasswordEmailPost);
/**
 *@route GET /reset-password/:id
 * @group reset-password
 * @returns {object} 200 - request for reset password form
 * @returns {Error}  404 - Invalid Page error
 */
// GET request for reset password form
router.get('/:id', accountController.resetPasswordGet);
/**
 *@route POST /reset-password/:id
 * @group reset-password
 * @returns {object} 200 - request for reset password form
 * @returns {Error}  404 - Invalid Page error
 */
// PUT request for reset password form
router.post('/:id', accountController.resetPasswordEmailPut);

module.exports = router;
