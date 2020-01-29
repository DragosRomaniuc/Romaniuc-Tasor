// Dependencies
const express = require('express'),
  // Middleware
  {
    authenticationOnAccount
  } = require('../../middleware'),
  router = express.Router(),
    {
        allAccounts,
        assignCategory
  } = require('../../controllers').friendController;

// GET request for friends list.

router.get('/', authenticationOnAccount, allAccounts);
router.get('/addCategory', authenticationOnAccount, assignCategory);

module.exports = router;
