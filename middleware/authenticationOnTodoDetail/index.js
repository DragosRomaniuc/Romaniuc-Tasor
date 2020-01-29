var mongoose = require('mongoose');

const { Account, Todo } = require('../../models'),
  // Wrapper middleware
  withAuthentication = require('../withAuthentication'),
  // Wrapped middleware
  authenticationOnTodoDetail = async (
    { body, session: { userId }, params: { id, todoId } },
    res,
    next
  ) =>{
    try{
        todoId = mongoose.Types.ObjectId(todoId);
        let todo = await Todo.find({_id: todoId });
        console.log(todo);
        Account.findById(userId, 'userName')
            .populate({
                path: 'categories',
                match: { _id: id },
                model: 'Category',
                populate: {
                    path: 'todoList',
                    match: { _id: todoId },
                    model: 'Todo'
                }
            })
            .exec(async (err, account) => {
                // API error.
                if (err) return next(err);
                // No result.
                if (account == null) {
                    // const { userName, categories } = res.locals.account,
                    //     { todoList } = categories[0],
                    //     {
                    //         _id,
                    //         title,
                    //         checked,
                    //         createdAtFormatted,
                    //         lastEditFormatted,
                    //         public
                    //     } = todoList[0];
                    res.locals.account = {
                        userName: "GUEST",
                        email: "GUEST",
                        validated: true,
                        categories: [
                            {
                                todoList:
                                    [
                                        todo[0]
                                    ]

                            }
                        ]
                    }
                    return next();
                }
                // Success - Account valid
                res.locals.account = account;
                next();
            });
    } catch (err) {
        res.render('error',{
            message: 'Task does not exist!',
            error: {
                status: 'Log in or try to access a valid and public Task'
            }
        })
    }
  }


// module.exports = withAuthentication(authenticationOnTodoDetail);
module.exports = authenticationOnTodoDetail;
