const crypto = require('crypto');

const genRandomString = length =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

const checkPassword = (passWordHash, pass, salt) =>
  sha512(pass, salt).passwordHash === passWordHash;

const saltHashPassword = userPassword => {
  const salt = genRandomString(16);
  const passwordData = sha512(userPassword, salt);
  return passwordData;
};

module.exports = {
  saltHashPassword,
  checkPassword,
  genRandomString
};
