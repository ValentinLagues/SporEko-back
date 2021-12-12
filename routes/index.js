const usersRouter = require('./users');
const textilesRouter = require('./textiles');

// on mettrait-y pas les '/nomsDeRoute' en français ? (UX)
// pour admin -> rajouter un mot indevinable ? genre /saumonfume/users pour rendre plus difficile l'acces à admin?
// + blocage par authentification à toutes les requêtes sur /saumonfume
const setupRoutes = (app) => {
  app.use('/users', usersRouter); // donc sur postman c'est https://localhost:8000/users le début de toutes les requêtes pour users. le router sert à ça
  app.use('/textiles', textilesRouter);
};

module.exports = {
  setupRoutes,
};
