// TODO: Edit layout
const { capitalizeFirstLetter } = require('../../../utility');
module.exports = ({ originalUrl: redirectUrl }, res, next) => {
  const { userName, categories } = res.locals.account,
    { todoList } = categories[0],
    {
      _id,
      title,
      checked,
      createdAtFormatted,
      lastEditFormatted,
        public
    } = todoList[0];

  console.log(res.locals.account.categories[0])

  // Account exist. Send todo list.
  res.render('pages/todo', {
    _id,
    checked,
    name: capitalizeFirstLetter(userName),
    title: 'To-Do Detail',
      publicTodo: public,
    todo: capitalizeFirstLetter(title),
    buttonTitle: null,
    createdAtFormatted,
    lastEditFormatted,
    redirectUrl,
    placeHolder: 'Add new to-do'
  });
};
