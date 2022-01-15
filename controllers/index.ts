import express from 'express';
import usersRouter from './users';
import offersRouter from './offers';
import gendersRouter from './genders';
import sportsRouter from './sports';
import sizesRouter from './sizes';
import conditionsRouter from './conditions';
import brandsRouter from './brands';
import colorsRouter from './colors';
import colissimosRouter from './colissimos';
import deliverersRouter from './deliverers';
import deliverer_pricesRouter from './deliverer_prices';
import offer_deliverersRouter from './offer_deliverers';
import mondialRelayRouter from './mondial_relay';
import athleticsRouter from './athletics';
import textilesRouter from './textiles';
import categoriesRouter from './categories';
import itemsRouter from './items';
import weightsRouter from './weights';
import authRouter from './auth';
import countriesRouter from './countries';

const setupRoutes = (app: express.Application) => {
  app.use('/users', usersRouter);
  app.use('/offers', offersRouter);
  app.use('/genders', gendersRouter);
  app.use('/countries', countriesRouter);
  app.use('/sports', sportsRouter);
  app.use('/sizes', sizesRouter);
  app.use('/conditions', conditionsRouter);
  app.use('/deliverers', deliverersRouter);
  app.use('/deliverer_prices', deliverer_pricesRouter);
  app.use('/offer_deliverers', offer_deliverersRouter);
  app.use('/brands', brandsRouter);
  app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  app.use('/mondialrelay', mondialRelayRouter);
  app.use('/athletics', athleticsRouter);
  app.use('/textiles', textilesRouter);
  app.use('/categories', categoriesRouter);
  app.use('/items', itemsRouter);
  app.use('/weights', weightsRouter);
  app.use('/login', authRouter);
};

export default setupRoutes;
