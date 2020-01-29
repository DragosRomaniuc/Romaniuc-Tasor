// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { accountController } = require('../../../controllers');

// GET request for sign up form.
router.get('/:id', accountController.accountValidateGet);

module.exports = router;
