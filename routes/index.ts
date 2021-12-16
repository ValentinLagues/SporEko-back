const textilesRouter = require('./textiles');

const setupRoutes = (app) => {
  app.use('/textiles', textilesRouter);
};

module.exports = {
  setupRoutes,
};