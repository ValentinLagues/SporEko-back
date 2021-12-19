import { Application } from 'express';
const Users = require('./users');
// const Offers = require('./offers');
// const Genders = require('./genders');
const Sports = require('./sports');
// const Sizes = require('./sizes');
// const Conditions = require('./conditions');
// const Brands = require('./brands');
const Colors = require('./colors');
const Colissimos = require('./colissimos');
// const MondialRelay = require('./mondialRelay');
// const SportifStyles = require('./sportifStyles');
const Textiles = require('./textiles');
// const Categories = require('./categories');

const setupRoutes = (app: Application) => {
  app.use('/users', Users.usersRouter);
  // app.use('/offers', Offers.offersRouter);
  // app.use('/genders', Genders.gendersRouter);
  app.use('/sports', Sports.sportsRouter);
  // app.use('/sizes', Sizes.sizesRouter);
  // app.use('/conditions', Conditions.conditionsRouter);
  // app.use('/brands', Brands.brandsRouter);
  app.use('/colors', Colors.colorsRouter);
  app.use('/colissimos', Colissimos.colissimosRouter);
  // app.use('/modialRelay', MondialRelay.mondialRelayRouter);
  // app.use('/sportifStyles', SportifStyles.sportifStylesRouter);
  app.use('/textiles', Textiles.textilesRouter);
  // app.use('/categories', Categories.categoriesRouter);
};

module.exports = { setupRoutes };
