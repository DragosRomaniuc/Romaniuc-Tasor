module.exports = wrappedFunction => (req, res, next) => {
  // If session or account does not exist, redirect to login page.
  // Else, keep process on chain.
  if (!req.session.userId)
    return res.redirect(req.app.locals.baseUrl + 'login');

  wrappedFunction(req, res, next);
};
