const loginRouter = require('./login');
const logOutRouter = require('./logOut');
const signUpRouter = require('./signUp');
const validateRouter = require('./validate');
const resetPasswordRouter = require('./resetPassword');

module.exports = {
  loginRouter,
  logOutRouter,
  signUpRouter,
  validateRouter,
  resetPasswordRouter
};
