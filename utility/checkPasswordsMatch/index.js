module.exports = (value, { req, loc, path }) => {
  if (value !== req.body.password2) {
    throw new Error("Passwords don't match");
  } else {
    return value;
  }
};
