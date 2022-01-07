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
import mondialRelayRouter from './mondial_relay';
import athleticsRouter from './athletics';
import textilesRouter from './textiles';
import categoriesRouter from './categories';
import authRouter from './auth';

const setupRoutes = (app: express.Application) => {
  app.use('/users', usersRouter);
  app.use('/offers', offersRouter);
  app.use('/genders', gendersRouter);
  app.use('/sports', sportsRouter);
  app.use('/sizes', sizesRouter);
  app.use('/conditions', conditionsRouter);
  app.use('/brands', brandsRouter);
  app.use('/colors', colorsRouter);
  app.use('/colissimos', colissimosRouter);
  app.use('/mondialrelay', mondialRelayRouter);
  app.use('/athletics', athleticsRouter);
  app.use('/textiles', textilesRouter);
  app.use('/categories', categoriesRouter);
  app.use('/login', authRouter);
};

export default setupRoutes;
