import { Request, Response, NextFunction, Router } from 'express';
import * as Deliverer from '../models/deliverer';
import IDeliverer from '../interfaces/IDeliverer';
import { ErrorHandler } from '../helpers/errors';

const deliverersRouter = Router();

deliverersRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_deliverer';
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

  Deliverer.getAll(sortBy, order)
    .then((deliverers: Array<IDeliverer>) => {
      res.status(200).json(deliverers);
    })
    .catch((err) => next(err));
});

deliverersRouter.get(
  '/:idDeliverer',
  (req: Request, res: Response, next: NextFunction) => {
    const { idDeliverer } = req.params;
    Deliverer.getById(Number(idDeliverer))
      .then((deliverer: IDeliverer) => {
        if (deliverer === undefined) {
          res.status(404).send('Deliverer not found');
        }
        res.status(200).json(deliverer);
      })
      .catch((err) => next(err));
  }
);

deliverersRouter.post(
  '/',
  Deliverer.validateDeliverer,
  Deliverer.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const deliverer = req.body as IDeliverer;
        deliverer.id_deliverer = await Deliverer.create(deliverer);
        res.status(201).json(deliverer);
      } catch (err) {
        next(err);
      }
    })();
  }
);

deliverersRouter.put(
  '/:idDeliverer',
  Deliverer.nameIsFree,
  Deliverer.validateDeliverer,
  (req: Request, res: Response) => {
    void (async () => {
      const { idDeliverer } = req.params;
      const delivererUpdated = await Deliverer.update(
        Number(idDeliverer),
        req.body as IDeliverer
      );
      if (delivererUpdated) {
        res.status(200).send('Deliverer updated');
      } else if (!delivererUpdated) {
        res.status(404).send('Deliverer not found');
      } else {
        throw new ErrorHandler(500, `Deliverer can't be updated`);
      }
    })();
  }
);

deliverersRouter.delete(
  '/:idDeliverer',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idDeliverer } = req.params;
        const delivererDeleted = await Deliverer.destroy(Number(idDeliverer));
        if (delivererDeleted) {
          res.status(200).send('Deliverer deleted');
        } else {
          throw new ErrorHandler(404, `Deliverer not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default deliverersRouter;
