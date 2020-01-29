// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// GET request for email form.
router.get('/', accountController.resetPasswordEmailGet);

// POST request for email form.
router.post('/', accountController.resetPasswordEmailPost);

// GET request for reset password form
router.get('/:id', accountController.resetPasswordGet);

// PUT request for reset password form
router.post('/:id', accountController.resetPasswordEmailPut);

module.exports = router;
