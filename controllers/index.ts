import express from 'express';
<<<<<<< HEAD
import brandsRouter from './brands';
=======

>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
// import UsersRouter from './users';
// import OffersRouter from './offers';
import GendersRouter from './genders';
import sportsRouter from './sports';
<<<<<<< HEAD
// import SizesRouter from './sizes';
import conditionsRouter from './conditions';
=======
import SizesRouter from './sizes';
// import ConditionsRouter from './conditions';
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
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
  app.use('/genders', gendersRouter);
  app.use('/sports', sportsRouter);
<<<<<<< HEAD
  // app.use('/sizes', sizesRouter);
  app.use('/conditions', conditionsRouter);
  app.use('/brands', brandsRouter);
=======
  app.use('/sizes', sizesRouter);
  // app.use('/conditions', conditionsRouter);
  // app.use('/brands', brandsRouter);
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
  app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  // app.use('/modialRelay', mondialRelayRouter);
  // app.use('/sportifStyles', sportifStylesRouter);
  app.use('/textiles', textilesRouter);
  // app.use('/categories', categoriesRouter);
};

export default setupRoutes;

