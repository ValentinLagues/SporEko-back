import { Request, Response, NextFunction, Router } from 'express';
import Sport from '../models/sport';
import ISport from '../interfaces/ISport';
import { ErrorHandler } from '../helpers/errors';

const sportsRouter = Router();

sportsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Sport.getAll(sortBy, order, firstItem, limit)
    .then((sports: Array<ISport>) => {
      res.setHeader(
        'Content-Range',
        `sports : 0-${sports.length}/${sports.length + 1}`
      );
      res.status(200).json(sports);
    })
    .catch((err) => next(err));
});

sportsRouter.get(
  '/:idSport',
  (req: Request, res: Response, next: NextFunction) => {
    const idSport = req.params.idSport;
    Sport.getById(Number(idSport))
      .then((sport: ISport) => {
        if (sport === undefined) {
          res.status(404).send('Sport not found');
        }
        res.status(200).json(sport);
      })
      .catch((err) => next(err));
  }
);

sportsRouter.post(
  '/',
  Sport.nameIsFree,
  Sport.validateSport,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const sport = req.body as ISport;
        const idSport = await Sport.create(sport);
        res.status(201).json({ id_sport: idSport, id: idSport, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

sportsRouter.post(
  '/:id/image',
  Sport.upload.single('imageSport'),
  (req: Request, res: Response, next: NextFunction) => {
    void (() => {
      try {
        const icon = `${req.protocol}://${req.get('host')}/imageSport/${
          req.file?.filename
        }`;
        res.status(201).json(icon);
      } catch (err) {
        next(err);
      }
    })();
  }
);

sportsRouter.put(
  '/:idsport',
  Sport.nameIsFree,
  Sport.validateSport,
  (req: Request, res: Response) => {
    void (async () => {
      const idsport = req.params.idSport;

      const sportUpdated = await Sport.update(
        Number(idsport),
        req.body as ISport
      );
      if (sportUpdated) {
        res.status(200).json({ id: idsport });
      } else if (!sportUpdated) {
        res.status(404).send('Sport not found');
      } else {
        throw new ErrorHandler(500, `Sport can't be updated`);
      }
    })();
  }
);

sportsRouter.delete(
  '/:idsport',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idsport = req.params.idSport;
        const sportDeleted = await Sport.destroy(Number(idsport));
        if (sportDeleted) {
          res.status(200).send('Sport deleted');
        } else {
          throw new ErrorHandler(404, `Sport not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default sportsRouter;
