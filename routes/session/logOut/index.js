// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// POST request for login form.
router.post('/', accountController.accountLogOutPost);

module.exports = router;
