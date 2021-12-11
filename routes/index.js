const usersRouter = require('./users');

const setupRoutes = (app) => {
  app.use('/users', usersRouter);
};

module.exports = {
  setupRoutes,
};
