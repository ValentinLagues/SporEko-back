<<<<<<< HEAD
import { Application } from 'express';
const Users = require('./users');
// const Offers = require('./offers');
const Genders = require('./genders');
const Sports = require('./sports');
const Sizes = require('./sizes');
const Conditions = require('./conditions');
const Brands = require('./brands');
const Colors = require('./colors');
const Colissimos = require('./colissimos');
const MondialRelay = require('./mondialRelay');
const SportifStyles = require('./sportifStyles');
const Textiles = require('./textiles');
const Categories = require('./categories');

const setupRoutes = (app: Application) => {
  app.use('/users', Users.usersRouter);
  // app.use('/offers', Offers.offersRouter);
  app.use('/genders', Genders.gendersRouter);
  app.use('/sports', Sports.sportsRouter);
  app.use('/sizes', Sizes.sizesRouter);
  app.use('/conditions', Conditions.conditionsRouter);
  app.use('/brands', Brands.brandsRouter);
  app.use('/colors', Colors.colorsRouter);
  app.use('/colissimos', Colissimos.colissimosRouter);
  app.use('/mondialRelay', MondialRelay.mondialRelayRouter);
  app.use('/sportifStyles', SportifStyles.sportifStylesRouter);
  app.use('/textiles', Textiles.textilesRouter);
  app.use('/categories', Categories.categoriesRouter);
=======
import express from 'express';
// import Users from './users';
// import Offers from './offers';
// import Genders from './genders';
// import Sports from './sports';
// import Sizes from './sizes';
// import Conditions from './conditions';
// import Brands from './brands';
// import Colors from './colors';
// import Colissimos from './colissimos';
import colissimosRouter from './colissimos';
// import MondialRelay from './mondialRelay';
// import SportifStyles from './sportifStyles';
// import Textiles from './textiles';
// import Categories from './categories';

const setupRoutes = (app: express.Application) => {
  // app.use('/users', usersRouter);
  // app.use('/offers', offersRouter);
  // app.use('/genders', gendersRouter);
  // app.use('/sports', sportsRouter);
  // app.use('/sizes', sizesRouter);
  // app.use('/conditions', conditionsRouter);
  // app.use('/brands', brandsRouter);
  // app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  // app.use('/modialRelay', mondialRelayRouter);
  // app.use('/sportifStyles', sportifStylesRouter);
  // app.use('/textiles', textilesRouter);
  // app.use('/categories', categoriesRouter);
>>>>>>> a6c7f92ea7db11e811040cf3c3f32f99082fc86d
};

export default setupRoutes;
