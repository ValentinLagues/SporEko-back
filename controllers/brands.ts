import { Request, Response, NextFunction, Router } from 'express';
import * as Brand from '../models/brand';
import IBrand from '../interfaces/IBrand';
import { ErrorHandler } from '../helpers/errors';

const brandsRouter = Router();

brandsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Colissimo.getAll()
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
      .then((colissimo: IColissimo) => res.status(200).json(colissimo))
      .catch((err) => next(err));
  }
);

colissimosRouter.post(
  '/',
  Colissimo.nameIsFree,
  Colissimo.validateColissimo,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const colissimo = req.body as IColissimo;
      colissimo.id_colissimo = await Colissimo.create(colissimo);
      res.status(201).json(colissimo);
    } catch (err) {
      next(err);
    }
  }
);

colissimosRouter.put(
  '/:idcolissimo',
  Colissimo.nameIsFree,
  Colissimo.validateColissimo,
  async (req: Request, res: Response) => {
    const { idcolissimo } = req.params;

    const colissimoUpdated = await Colissimo.update(
      Number(idcolissimo),
      req.body as IColissimo
    );
    if (colissimoUpdated) {
      res.status(200).send('Colissimo mis à jour');
    } else {
      throw new ErrorHandler(500, `Ce colissimo ne peut pas être mis à jour`);
    }
  }
);

colissimosRouter.delete(
  '/:idcolissimo',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idcolissimo } = req.params;
      const colissimoDeleted = await Colissimo.destroy(Number(idcolissimo));
      if (colissimoDeleted) {
        res.status(200).send('Colissimo supprimé');
      } else {
        throw new ErrorHandler(404, `Colissimo non trouvé`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default brandsRouter;