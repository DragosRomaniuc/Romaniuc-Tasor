module.exports = (
  {
    session,
    app: {
      locals: { baseUrl }
    }
  },
  res,
  next
) => {
  // If there is an active user, logout.
  session &&
    session.destroy(err => {
      // If logout failed, send error.
      // Else, navigate to login page.
      if (err) return next(err);
      session = null;
      res.redirect(baseUrl + 'login');
    });
};
