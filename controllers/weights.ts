import { Request, Response, NextFunction, Router } from 'express';
import * as Weight from '../models/weight';
import IWeight from '../interfaces/IWeight';
import { ErrorHandler } from '../helpers/errors';

const weightsRouter = Router();

weightsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_weight';
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

  Weight.getAll(sortBy, order)
    .then((weights: Array<IWeight>) => {
      res.status(200).json(weights);
    })
    .catch((err) => next(err));
});

weightsRouter.get(
  '/:idWeight',
  (req: Request, res: Response, next: NextFunction) => {
    const { idWeight } = req.params;
    Weight.getById(Number(idWeight))
      .then((weight: IWeight) => {
        if (weight === undefined) {
          res.status(404).send('Weight not found');
        }
        res.status(200).json(weight);
      })
      .catch((err) => next(err));
  }
);

weightsRouter.post(
  '/',
  Weight.nameIsFree,
  Weight.validateWeight,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const weight = req.body as IWeight;
        weight.id_weight = await Weight.create(weight);
        res.status(201).json(weight);
      } catch (err) {
        next(err);
      }
    })();
  }
);

weightsRouter.put(
  '/:idweight',
  Weight.nameIsFree,
  Weight.validateWeight,
  (req: Request, res: Response) => {
    void (async () => {
      const { idweight } = req.params;

      const weightUpdated = await Weight.update(
        Number(idweight),
        req.body as IWeight
      );
      if (weightUpdated) {
        res.status(200).send('Weight updated');
      } else if (!weightUpdated) {
        res.status(404).send('Weight not found');
      } else {
        throw new ErrorHandler(500, `Weight can't be updated`);
      }
    })();
  }
);

weightsRouter.delete(
  '/:idweight',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idweight } = req.params;
        const weightDeleted = await Weight.destroy(Number(idweight));
        if (weightDeleted) {
          res.status(200).send('Weight deleted');
        } else {
          throw new ErrorHandler(404, `Weight not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default weightsRouter;
