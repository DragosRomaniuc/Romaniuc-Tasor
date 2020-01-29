const { capitalizeFirstLetter } = require('../../../utility');
module.exports = ({ baseUrl: redirectUrl }, res, next) => {
  const { userName, categories } = res.locals.account;
  // Account exist. Send categories.
  res.render('index', {
    title: 'Category List',
    name: capitalizeFirstLetter(userName),
    list: categories,
    redirectUrl,
    placeHolder: 'Add new category'
  });
};
