module.exports = connection => {
  return async function(next) {
    try {
      const account = this;
      const Todo = connection.model('Todo');
      await Todo.deleteMany({ account: account._id });
      next();
    } catch (error) {
      next(error);
    }
  };
};
