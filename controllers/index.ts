import express from 'express';
import brandsRouter from './brands';
// import UsersRouter from './users';
// import OffersRouter from './offers';
// import GendersRouter from './genders';
import sportsRouter from './sports';
// import SizesRouter from './sizes';
import conditionsRouter from './conditions';
// import BrandsRouter from './brands';
import colorsRouter from './colors';
import colissimosRouter from './colissimos';
// import MondialRelayRouter from './mondialRelay';
// import SportifStylesRouter from './sportifStyles';
import textilesRouter from './textiles';
// import CategoriesRouter from './categories';

const setupRoutes = (app: express.Application) => {
  // app.use('/users', usersRouter);
  // app.use('/offers', offersRouter);
  // app.use('/genders', gendersRouter);
  app.use('/sports', sportsRouter);
  // app.use('/sizes', sizesRouter);
  app.use('/conditions', conditionsRouter);
  app.use('/brands', brandsRouter);
  app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  // app.use('/modialRelay', mondialRelayRouter);
  // app.use('/sportifStyles', sportifStylesRouter);
  app.use('/textiles', textilesRouter);
  // app.use('/categories', categoriesRouter);
};

export default setupRoutes;
