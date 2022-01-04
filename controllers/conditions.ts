import { Request, Response, NextFunction, Router } from 'express';
import * as Condition from '../models/condition';
import ICondition from '../interfaces/ICondition';
import { ErrorHandler } from '../helpers/errors';

const conditionsRouter = Router();

conditionsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Condition.getAll()
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
  Condition.nameIsFree,
  Condition.validateCondition,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const condition = req.body as ICondition;
      condition.id_condition = await Condition.create(condition);
      res.status(201).json(condition);
    } catch (err) {
      next(err);
    }
  }
);

conditionsRouter.put(
  '/:idCondition',
  Condition.nameIsFree,
  Condition.validateCondition,
  async (req: Request, res: Response) => {
    const { idCondition } = req.params;
    const conditionUpdated = await Condition.update(
      Number(idCondition),
      req.body as ICondition
    );
    if (conditionUpdated) {
      res.status(200).send('Etat mis à jour');
    } else {
      throw new ErrorHandler(500, `Cet état ne peut pas être mise à jour`);
    }
  }
);

conditionsRouter.delete(
  '/:idCondition',
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default conditionsRouter;