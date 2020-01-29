// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// GET request for sign up form.
router.get('/', accountController.accountCreateGet);

// POST request for sign up form.
router.post('/', accountController.accountCreatePost);

module.exports = router;
