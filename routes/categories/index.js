// Dependencies
const express = require('express'),
    router = express.Router(),
    // Middleware
    {
        authenticationOnCategory,
        authenticationOnTodo,
        authenticationOnTodoDetail,
        authenticationOnAccount
    } = require('../../middleware'),
    // Category controllers.
    {
        categoriesList,
        newCategory,
        editCategory,
        deleteCategory
    } = require('../../controllers').categoriesController,
    // To-do controllers.
    {
        todoList,
        todoDetail,
        newTodo,
        editTodo,
        deleteTodo
    } = require('../../controllers').todosController,
    // Base URL for to-do routes.
    todoBaseUrl = '/:id/todos';

/*
 ** CATEGORY ROUTES
 */

// GET request for categories list.
/**
 *@route GET /categories
 * @group categories - categories list
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/', authenticationOnCategory, categoriesList);

// POST request for creating a new category.
/**
 *@route POST /categories/new
 * @group categories - POST request for creating a new category
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.post('/new', authenticationOnAccount, newCategory);

/**
 *@route GET /categories/:id
 * @group categories - Tasks list page
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.get('/:id', authenticationOnAccount, (req, res) =>
    res.redirect(
        req.app.locals.baseUrl + 'categories/' + req.params.id + '/todos'
    )
);

// PUT request for updating a category.
/**
 *@route PUT /categories/edit
 * @group categories - request for updating a category
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.put('/edit', authenticationOnAccount, editCategory);


/**
 *@route DELETE /categories/delete
 * @group categories - request for deleting a category
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
// DELETE request for deleting a category.
router.delete('/delete', authenticationOnAccount, deleteCategory);

/*
 ** TO-DO ROUTES
 */

/** To-Do list page. **/

// GET request for task list.

/**
 *@route GET /categories/:categoryID/todos
 * @group categories - request for task list
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.get(todoBaseUrl, authenticationOnTodo, todoList);


/**
 *@route POST /categories/:categoryID/todos/new
 * @group categories - request for creating a task in task page
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
// POST request for creating a todo in todo list page.
router.post(`${todoBaseUrl}/new`, authenticationOnAccount, newTodo);




/**
 *@route PUT /categories/:categoryID/todos/edit
 * @group categories - request for updating a task in task list page.
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
router.put(`${todoBaseUrl}/edit`, authenticationOnAccount, editTodo);





/**
 *@route DELETE /categories/:categoryID/todos/delete
 * @group categories - request for deleting a task in task list page.
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
// DELETE request for deleting a task in task list page.
router.delete(`${todoBaseUrl}/delete`, authenticationOnAccount, deleteTodo);






/**
 *@route GET /categories/:categoryID/todos/:taskID
 * @group categories - request for task detail.
 * @returns {object} 200 - Categories List
 * @returns {Error}  404 - Invalid Page error
 */
/** To-Do detail page. **/

// GET request for task detail.
router.get(`${todoBaseUrl}/:todoId`, authenticationOnTodoDetail, todoDetail);





/**
 *@route PUT /categories/:categoryID/todos/:taskid/edit
 * @group categories - request for updating a task.
 * @returns {object} 200 - Task Edited
 * @returns {Error}  404 - Invalid Page error
 */
// PUT request for updating a task.
router.put(`${todoBaseUrl}/:todoId/edit`, authenticationOnAccount, editTodo);




/**
 *@route delete /categories/:categoryID/todos/:taskID/delete
 * @group categories - request for deleting a task.
 * @returns {object} 200 - Task deleted
 * @returns {Error}  404 - Invalid Page error
 */
// DELETE request for deleting a task.
router.delete(
    `${todoBaseUrl}/:todoId/delete`,
    authenticationOnAccount,
    deleteTodo
);

module.exports = router;
