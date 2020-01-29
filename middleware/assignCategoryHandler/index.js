// Model
const { Account, Category } = require('../../models');

const { capitalizeFirstLetter } = require('../../utility');

module.exports = async (req, res, next) => {
    // console.log(res.locals.account.categories[0].accounts);
    const {
        categoryId,
        toAssign,
        ownerId
    } = req.query;

    const originalUrl = req.originalUrl;
    const baseUrl = req.baseUrl;

    let foundUser = await Account.findById({
        _id: toAssign
    });

    // if(!foundUser) {
    //     res.render('feedback', {
    //         message: 'Could not assign to that user!'
    //     })
    // }

    let foundCategory = await Category.findById({
        _id: categoryId
    });

    // if(!foundCategory) {
    //     res.render('feedback', {
    //         message: 'Category does not exist!'});
    // };


    let renderMessage = `${foundUser.userName} successfully assigned to ${foundCategory.title} by${res.locals.account.userName}. `;

    if (!foundUser.categories.includes(categoryId)) {
        foundUser.categories.push(categoryId);
        foundCategory.accounts.push(toAssign);
        await foundUser.save();
        await foundCategory.save();
    } else {
        renderMessage = 'User is already assigned to this category!';
    };




    console.log(req.query,'addFriendCategory')
    // console.log(res.locals.account,'din rendertodos')
    // const { _id, userName, categories } = res.locals.account,
    //     {
    //         accounts,
    //         title,
    //         createdAtFormatted,
    //         lastEditFormatted,
    //         todoList
    //     } = categories[0];
    // const baseUrl = res.locals.baseUrl;
    console.log(res.locals.account,'addFriendCategory here');

    // accounts.find(accountId => {
    //     console.log('accId',accountId,'iD',_id)
    //     console.log(accountId.toString() !== _id.toString())
    // })

    // Account exist. Send todo list.s
    res.render('feedback', {
        message: renderMessage,
        // name: capitalizeFirstLetter(userName),
        // title: 'Your To-Do List',
        // subTitle: 'Category:',
        // subTitle2: capitalizeFirstLetter(title),
        // // sharingWith: accounts.find(accountId => accountId.toString() !== _id.toString()),
        // buttonTitle: 'Category',
        // list: todoList,
        // createdAtFormatted,
        // lastEditFormatted,
        // redirectUrl,
        // placeHolder: 'Add new to-do',
        // categoryInfo: {
        //     categoryOwner: _id,
        //     categoryId: res.locals.account.categories[0]._id,
        //     categoryTitle: res.locals.account.categories[0].title,
        // }

    });
};
