import express from 'express';
// import Users from './users';
// import Offers from './offers';
// import Genders from './genders';
// import Sports from './sports';
// import Sizes from './sizes';
// import Conditions from './conditions';
import brandsRouter from './brands';
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
  app.use('/brands', brandsRouter);
  // app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  // app.use('/modialRelay', mondialRelayRouter);
  // app.use('/sportifStyles', sportifStylesRouter);
  // app.use('/textiles', textilesRouter);
  // app.use('/categories', categoriesRouter);
};

export default setupRoutes;
