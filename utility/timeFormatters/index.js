const moment = require('moment');

const createdAtFormatted = function() {
  return moment(this.createdAt).format('MMMM Do, YYYY');
};

const lastLoginFormatted = function() {
  return moment(this.lastLogin).format('MMMM Do YYYY, h:mm:ss a');
};
const lastEditFormatted = function() {
  return moment(this.lastEdit).format('MMMM Do YYYY, h:mm:ss a');
};
module.exports = {
  createdAtFormatted,
  lastLoginFormatted,
  lastEditFormatted
};
