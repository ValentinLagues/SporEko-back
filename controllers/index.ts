import express from 'express';
// import usersRouter from './users';
// import offersRouter from './offers';
import gendersRouter from './genders';
// import sportsRouter from './sports';
import sizesRouter from './sizes';
// import conditionsRouter from './conditions';
// import brandsRouter from './brands';
// import colorsRouter from './colors';
// import colissimosRouter from './colissimos';
// import modialRelayRouter from './mondialRelay';
// import sportifStylesRouter from './sportifStyles';
// import textilesRouter from './textiles';
// import categoriesRouter from './categories';





// const Users = require('./users');
// // const Offers = require('./offers');
// const Genders = require('./genders');
// const Sports = require('./sports');
// const Sizes = require('./sizes');
// // const Conditions = require('./conditions');
// // const Brands = require('./brands');
// const Colors = require('./colors');
// const Colissimos = require('./colissimos');
// // const MondialRelay = require('./mondialRelay');
// // const SportifStyles = require('./sportifStyles');
// const Textiles = require('./textiles');
// // const Categories = require('./categories');

const setupRoutes = (app: express.Application) => {
  // app.use('/users', usersRouter);
  // app.use('/offers', offersRouter);
  app.use('/genders', gendersRouter);
  // app.use('/sports', sportsRouter);
  app.use('/sizes', sizesRouter);
  // app.use('/conditions', conditionsRouter);
  // app.use('/brands', brandsRouter);
  // app.use('/colors', colorsRouter);
  // app.use('/colissimos', colissimosRouter);
  // app.use('/modialRelay', mondialRelayRouter);
  // app.use('/sportifStyles', sportifStylesRouter);
  // app.use('/textiles', textilesRouter);
  // app.use('/categories', categoriesRouter);
};

export default setupRoutes ;
