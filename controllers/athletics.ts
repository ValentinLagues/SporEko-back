import { Request, Response, NextFunction, Router } from 'express';
import Athletic from '../models/athletic';
import IAthletic from '../interfaces/IAthletic';
import { ErrorHandler } from '../helpers/errors';

const athleticsRouter = Router();

athleticsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Athletic.getAll(sortBy, order, firstItem, limit)
    .then((athletics: Array<IAthletic>) => {
      res.setHeader(
        'Content-Range',
        `athletics : 0-${athletics.length}/${athletics.length + 1}`
      );
      res.status(200).json(athletics);
    })
    .catch((err) => next(err));
});

athleticsRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    Athletic.getById(Number(id))
      .then((athletic: IAthletic) => {
        if (athletic) res.status(200).json(athletic);
        else res.status(404).send(`Athletic id:${id} not found.`);
      })
      .catch((err) => next(err));
  }
);

athleticsRouter.post(
  '/',
  Athletic.nameIsFree,
  Athletic.validateAthletic,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const athletics = req.body as IAthletic;
        const idAthletic = await Athletic.create(athletics);
        res
          .status(201)
          .json({ id_athletic: idAthletic, id: idAthletic, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

athleticsRouter.put(
  '/:idAthletic',
  Athletic.nameIsFree,
  Athletic.validateAthletic,
  (req: Request, res: Response) => {
    void (async () => {
      const idAthletic = req.params.idAthletic;
      const athleticUpdated = await Athletic.update(
        Number(idAthletic),
        req.body as IAthletic
      );
      if (athleticUpdated) {
        res.status(200).json({ id: idAthletic });
      } else if (!athleticUpdated) {
        res.status(404).send('Athletic not found');
      } else {
        throw new ErrorHandler(500, `Athletic can't be updated`);
      }
    })();
  }
);

athleticsRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const id = req.params.id;
        const athleticsDeleted = await Athletic.destroy(Number(id));
        if (athleticsDeleted) {
          res.status(200).send('Athletic deleted');
        } else {
          throw new ErrorHandler(404, `Athletic not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default athleticsRouter;
