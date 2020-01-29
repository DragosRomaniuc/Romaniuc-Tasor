// Dependencies
const express = require('express'),
    router = express.Router(),
    // Controller
    {
        accountDetails,
        accountDelete
    } = require('../../controllers').accountController;

// GET request for account details.
/**
 *@route GET /account
 * @group account
 * @returns {object} 200 - Account details.
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/', accountDetails);


/**
 *@route DELETE /account/delete
 * @group account
 * @returns {object} 200 - Account deleted.
 * @returns {Error}  404 - Invalid Page error
 */
// GET request for deleting account.
router.delete('/delete', accountDelete);

module.exports = router;
