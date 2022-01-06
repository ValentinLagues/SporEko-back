import { Request, Response, NextFunction, Router } from 'express';
import * as Athletics from '../models/athletic';
import IAthletics from '../interfaces/IAthletics';
import { ErrorHandler } from '../helpers/errors';

const athleticsRouter = Router();

athleticsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Athletics.getAll()
    .then((athletics: Array<IAthletics>) => {
      res.status(200).json(athletics);
    })
    .catch((err) => next(err));
});

athleticsRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    Athletics.getById(Number(id))
      .then((athletic: IAthletics) => {
        if (athletic) res.status(200).json(athletic);
        else res.status(404).send(`Athletic id:${id} not found.`);
      })
      .catch((err) => next(err));
  }
);

athleticsRouter.post(
  '/',
  Athletics.nameIsFree,
  Athletics.validateAthletics,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const athletics = req.body as IAthletics;
        athletics.id_athletic = await Athletics.create(athletics);
        res.status(201).json(athletics);
      } catch (err) {
        next(err);
      }
    })();
  }
);

athleticsRouter.put(
  '/:id',
  Athletics.nameIsFree,
  Athletics.validateAthletics,
  (req: Request, res: Response) => {
    void (async () => {
      const { id } = req.params;
      const athleticUpdated = await Athletics.update(
        Number(id),
        req.body as IAthletics
      );
      if (athleticUpdated) {
        res.status(200).send('Sportif Styles mis à jour');
      } else if (!athleticUpdated) {
        res.status(404).send('Size not found');
      } else {
        throw new ErrorHandler(
          500,
          `Ce Sportif Styles ne peut pas être mis à jour`
        );
      }
    })();
  }
);

athleticsRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { id } = req.params;
        const athleticsDeleted = await Athletics.destroy(Number(id));
        if (athleticsDeleted) {
          res.status(200).send('Sportif Styles supprimé');
        } else {
          throw new ErrorHandler(404, `Sportif Styles non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default athleticsRouter;
