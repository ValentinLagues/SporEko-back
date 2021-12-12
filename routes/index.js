const usersRouter = require('./users');
const textilesRouter = require('./textiles');

// on mettrait-y pas les '/nomsDeRoute' en français ? (UX)
//pour admin -> rajouter un mot indevinable ? genre /saumonfume/users pour rendre plus difficile l'acces à admin?
// + blocage par authentification à toutes les requêtes sur /saumonfume
const setupRoutes = (app) => {
  app.use('/users', usersRouter);
  app.use('/textiles', textilesRouter);
};

module.exports = {
  setupRoutes,
};
