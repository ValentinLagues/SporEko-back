import { Request, Response, NextFunction, Router } from 'express';
import Countries from '../models/country';
import ICountry from '../interfaces/ICountry';
import { ErrorHandler } from '../helpers/errors';

const countriesRouter = Router();

countriesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Countries.getAll(sortBy, order, firstItem, limit)
    .then((countries: Array<ICountry>) => {
      res.setHeader(
        'Content-Range',
        `countries : 0-${countries.length}/${countries.length + 1}`
      );
      res.status(200).json(countries);
    })
    .catch((err) => next(err));
});

countriesRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Countries.getById(Number(id))
      .then((country: ICountry) => {
        if (country) res.status(200).json(country);
        else res.status(404).send(`Country id:${id} not found.`);
      })
      .catch((err) => next(err));
  }
);

countriesRouter.post(
  '/',
  Countries.nameIsFree,
  Countries.validatecountries,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const countries = req.body as ICountry;
        countries.id_country = await countries.create(countries);
        res.status(201).json(countries);
      } catch (err) {
        next(err);
      }
    })();
  }
);

countriesRouter.put(
  '/:id',
  Countries.nameIsFree,
  Countries.validatecountries,
  (req: Request, res: Response) => {
    void (async () => {
      const { id } = req.params;
      const countryUpdated = await Countries.update(
        Number(id),
        req.body as ICountry
      );
      if (countryUpdated) {
        res.status(200).json({ id: id });
      } else if (!countryUpdated) {
        res.status(404).send('Country not found');
      } else {
        throw new ErrorHandler(500, `Country can't be updated`);
      }
    })();
  }
);

countriesRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { id } = req.params;
        const countriesDeleted = await Countries.destroy(Number(id));
        if (countriesDeleted) {
          res.status(200).send('Country deleted');
        } else {
          throw new ErrorHandler(404, `Country not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default countriesRouter;
