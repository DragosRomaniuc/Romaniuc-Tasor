// Dependencies
const express = require('express');
const router = express.Router();

// Controller
const { subscribeController } = require('../../controllers');

// POST request for push notification subscription.
router.post('/', subscribeController);

module.exports = router;
