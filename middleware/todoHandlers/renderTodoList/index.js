const { capitalizeFirstLetter } = require('../../../utility');
const { Account } = require('../../../models');
const _ = require('lodash');
module.exports = async ({ originalUrl: redirectUrl }, res, next) => {
    // console.log(res.locals.account.categories[0].accounts);

    console.log(res.locals.account,'din rendertodos')
  const { _id, userName, categories } = res.locals.account,
    {
      accounts,
      title,
      createdAtFormatted,
      lastEditFormatted,
      todoList
    } = categories[0];
    const baseUrl = res.locals.baseUrl;
    console.log(res.locals.account,'blablabalhere');

    let usersSameCategory = accounts.find(accountId => accountId.toString() !== _id.toString());
    let usersSameCategoryNames = usersSameCategory === undefined ? null : _.map(await Account.find({_id: { $in : usersSameCategory}}).select('userName -_id'),'userName')  ;
    console.log(usersSameCategory);
  // Account exist. Send todo list.s
  res.render('index', {
    name: capitalizeFirstLetter(userName),
    title: 'Your To-Do List',
    subTitle: 'Category:',
    subTitle2: capitalizeFirstLetter(title),
    sharingWith: usersSameCategoryNames,
    buttonTitle: 'Category',
    list: todoList,
    createdAtFormatted,
    lastEditFormatted,
    redirectUrl,
    placeHolder: 'Add new to-do',
      categoryInfo: {
        categoryOwner: _id,
        categoryId: res.locals.account.categories[0]._id,
          categoryTitle: res.locals.account.categories[0].title,
      }

  });
};
