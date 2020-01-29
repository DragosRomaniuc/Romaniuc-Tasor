// Dependencies
const express = require('express'),
  router = express.Router(),
  // Controller
  {
    accountDetails,
    accountDelete
  } = require('../../controllers').accountController;

// GET request for account details.
router.get('/', accountDetails);

// GET request for deleting account.
router.delete('/delete', accountDelete);

module.exports = router;
