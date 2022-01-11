import { Request, Response, NextFunction, Router } from 'express';
import * as Condition from '../models/condition';
import ICondition from '../interfaces/ICondition';
import { ErrorHandler } from '../helpers/errors';

const conditionsRouter = Router();

conditionsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_condition';
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

  Condition.getAll(sortBy, order)
    .then((conditions: Array<ICondition>) => {
      res.status(200).json(conditions);
    })
    .catch((err) => next(err));
});

conditionsRouter.get(
  '/:idCondition',
  (req: Request, res: Response, next: NextFunction) => {
    const { idCondition } = req.params;
    Condition.getById(Number(idCondition))
      .then((condition: ICondition) => {
        if (condition === undefined) {
          res.status(404).send('Etat non trouvé');
        }
        res.status(200).json(condition);
      })
      .catch((err) => next(err));
  }
);

conditionsRouter.post(
  '/',
  Condition.validateCondition,
  Condition.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const condition = req.body as ICondition;
        condition.id_condition = await Condition.create(condition);
        res.status(201).json(condition);
      } catch (err) {
        next(err);
      }
    })();
  }
);

conditionsRouter.put(
  '/:idCondition',
  Condition.nameIsFree,
  Condition.validateCondition,
  (req: Request, res: Response) => {
    void (async () => {
      const { idCondition } = req.params;
      const conditionUpdated = await Condition.update(
        Number(idCondition),
        req.body as ICondition
      );
      if (conditionUpdated) {
        res.status(200).send('Etat mis à jour');
      } else if (!conditionUpdated) {
        res.status(404).send('Condition not found');
      } else {
        throw new ErrorHandler(500, `Cet état ne peut pas être mise à jour`);
      }
    })();
  }
);

conditionsRouter.delete(
  '/:idCondition',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idCondition } = req.params;
        const conditionDeleted = await Condition.destroy(Number(idCondition));
        if (conditionDeleted) {
          res.status(200).send('Etat supprimé');
        } else {
          throw new ErrorHandler(404, `Etat non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default conditionsRouter;
