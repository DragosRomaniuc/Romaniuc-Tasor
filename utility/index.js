const capitalizeFirstLetter = require('./capitalizeFirstLetter');
const getUrl = require('./getUrl');
const sendEmail = require('./sendEmail');
const {
  createdAtFormatted,
  lastLoginFormatted,
  lastEditFormatted
} = require('./timeFormatters');
const { saltHashPassword, checkPassword } = require('./security');

module.exports = {
  capitalizeFirstLetter,
  getUrl,
  sendEmail,
  createdAtFormatted,
  lastLoginFormatted,
  lastEditFormatted,
  saltHashPassword,
  checkPassword
};
