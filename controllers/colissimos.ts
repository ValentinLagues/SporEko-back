import { Request, Response, NextFunction, Router } from 'express';
import * as Colissimo from '../models/colissimo';
import IColissimo from '../interfaces/IColissimo';
import { ErrorHandler } from '../helpers/errors';

const colissimosRouter = Router();

colissimosRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_colissimo';
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

  Colissimo.getAll(sortBy, order)
    .then((colissimos: Array<IColissimo>) => {
      res.status(200).json(colissimos);
    })
    .catch((err) => next(err));
});

colissimosRouter.get(
  '/:idColissimo',
  (req: Request, res: Response, next: NextFunction) => {
    const { idColissimo } = req.params;
    Colissimo.getById(Number(idColissimo))
      .then((colissimo: IColissimo) => {
        if (colissimo === undefined) {
          res.status(404).send('Colissimo non trouvé');
        }
        res.status(200).json(colissimo);
      })
      .catch((err) => next(err));
  }
);

colissimosRouter.post(
  '/',
  Colissimo.nameIsFree,
  Colissimo.validateColissimo,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const colissimo = req.body as IColissimo;
        colissimo.id_colissimo = await Colissimo.create(colissimo);
        res.status(201).json(colissimo);
      } catch (err) {
        next(err);
      }
    })();
  }
);

colissimosRouter.put(
  '/:idColissimo',
  Colissimo.recordExists,
  Colissimo.nameIsFree,
  Colissimo.validateColissimo,
  (req: Request, res: Response) => {
    void (async () => {
      const { idColissimo } = req.params;

      const colissimoUpdated = await Colissimo.update(
        Number(idColissimo),
        req.body as IColissimo
      );
      if (colissimoUpdated) {
        res.status(200).send(req.body);
      } else {
        throw new ErrorHandler(500, `Ce colissimo ne peut pas être mis à jour`);
      }
    })();
  }
);

colissimosRouter.delete(
  '/:idColissimo',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idColissimo } = req.params;
        const colissimoDeleted = await Colissimo.destroy(Number(idColissimo));
        if (colissimoDeleted) {
          res.status(200).send('Colissimo supprimé');
        } else {
          throw new ErrorHandler(404, `Colissimo non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default colissimosRouter;
