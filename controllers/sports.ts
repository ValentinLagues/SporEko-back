import { Request, Response, NextFunction, Router } from 'express';
import * as Sport from '../models/sport';
import ISport from '../interfaces/ISport';
import { ErrorHandler } from '../helpers/errors';

const sportsRouter = Router();

sportsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_sport';
  let order: string = 'ASC';

  const {
    sort,
    // firstItem,
    // limit
  } = req.query;

  if (sort) {
    const sortToArray = sort.toString().split(' ');
    sortBy = sortToArray[0];
    order = sortToArray[1];
  }

  Sport.getAll(sortBy, order)
    .then((sports: Array<ISport>) => {
      res.status(200).json(sports);
    })
    .catch((err) => next(err));
});

sportsRouter.get(
  '/:idSport',
  (req: Request, res: Response, next: NextFunction) => {
    const { idSport } = req.params;
    Sport.getById(Number(idSport))
      .then((sport: ISport) => {
        if (sport === undefined) {
          res.status(404).send('Sport non trouvé');
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
        sport.id_sport = await Sport.create(sport);
        res.status(201).json(sport);
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
      const { idsport } = req.params;

      const sportUpdated = await Sport.update(
        Number(idsport),
        req.body as ISport
      );
      if (sportUpdated) {
        res.status(200).send('Sport mis à jour');
      } else if (!sportUpdated) {
        res.status(404).send('Sport not found');
      } else {
        throw new ErrorHandler(500, `Ce sport ne peut pas être mis à jour`);
      }
    })();
  }
);

sportsRouter.delete(
  '/:idsport',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idsport } = req.params;
        const sportDeleted = await Sport.destroy(Number(idsport));
        if (sportDeleted) {
          res.status(200).send('Sport supprimé');
        } else {
          throw new ErrorHandler(404, `Sport non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default sportsRouter;
