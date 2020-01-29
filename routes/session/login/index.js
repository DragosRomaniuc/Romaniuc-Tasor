// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// GET request for login form.
router.get('/', accountController.accountLoginGet);

// POST request for login form.
router.post('/', accountController.accountLoginPost);

module.exports = router;
