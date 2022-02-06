import { Request, Response, NextFunction, Router } from 'express';
import Country from '../models/country';
import ICountry from '../interfaces/ICountry';
import { ErrorHandler } from '../helpers/errors';

const countriesRouter = Router();

countriesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Country.getAll(sortBy, order, firstItem, limit)
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
  '/:idCountry',
  (req: Request, res: Response, next: NextFunction) => {
    const idCountry = req.params.idCountry;
    Country.getById(Number(idCountry))
      .then((country: ICountry) => {
        if (country) res.status(200).json(country);
        else res.status(404).send(`Country idCountry:${idCountry} not found.`);
      })
      .catch((err) => next(err));
  }
);

countriesRouter.post(
  '/',
  Country.nameIsFree,
  Country.validateCountry,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const country = req.body as ICountry;
        const idCountry = await Country.create(country);
        res
          .status(201)
          .json({ id_country: idCountry, id: idCountry, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

countriesRouter.put(
  '/:idCountry',
  Country.nameIsFree,
  Country.validateCountry,
  (req: Request, res: Response) => {
    void (async () => {
      const idCountry = req.params.idCountry;
      const countryUpdated = await Country.update(
        Number(idCountry),
        req.body as ICountry
      );
      if (countryUpdated) {
        res.status(200).json({ id: idCountry });
      } else if (!countryUpdated) {
        res.status(404).send('Country not found');
      } else {
        throw new ErrorHandler(500, `Country can't be updated`);
      }
    })();
  }
);

countriesRouter.delete(
  '/:idCountry',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idCountry = req.params.idCountry;
        const countriesDeleted = await Country.destroy(Number(idCountry));
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
