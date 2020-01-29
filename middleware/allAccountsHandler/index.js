const { capitalizeFirstLetter } = require('../../utility');
const { Account } = require('../../models');

module.exports = (req, res, next) => {
    const { userName, _id } = res.locals.account;
    console.log(req.originalUrl,'here')
    Account.find({_id: { $ne : _id}}, (err, user) => {
        let userMap = [];
        user && user.forEach(item => {
            userMap.push({_id:item._id, userName: item.userName})
        });

        if(req.query.toAssign) {
            console.log('asdasd, to asign is', req.query.toAssign)
        }

        res.render('index', {
            title: 'Assign users to ' + req.query.categoryTitle.toUpperCase() + ' category',
            name: capitalizeFirstLetter(userName),
            list: userMap,
            redirectUrl: req.originalUrl,
            placeHolder: 'Add new category',
            friendList: true,
            addInfo: {
                categoryId: req.query.categoryId,
                categoryOwner: req.query.categoryId,
                categoryTitle: req.query.categoryTitle
            },
            ownerId: res.locals.account._id
        });


    });
};
