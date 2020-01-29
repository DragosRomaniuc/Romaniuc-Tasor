const { saltHashPassword } = require('../../utility');

module.exports = function(next) {
  // Hashed password merged with salt.
  const { passwordHash, salt } = saltHashPassword(this.password);
  this.password = passwordHash;
  this.salt = salt;
  next();
};
