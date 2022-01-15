import { Request, Response, NextFunction, Router } from 'express';
import IChild from '../interfaces/IChild';
import * as Children from '../models/child';

const childrenRouter = Router();

childrenRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_child';
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

  Children.getAllChildren(sortBy, order)
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
});

childrenRouter.get(
  '/:idChild',
  (req: Request, res: Response, next: NextFunction) => {
    const { idChild } = req.params;
    Children.getChildById(Number(idChild))
      .then((result: IChild) => {
        if (result === undefined)
          res.status(404).send('Error retrieiving data');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

childrenRouter.post(
  '/',
  Children.validateChild,
  Children.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    const child = req.body as IChild;
    Children.createChild(child)
      .then((createChild) =>
        res.status(201).json({ id: createChild, ...req.body })
      )
      .catch((err) => next(err));
  }
);

childrenRouter.put(
  '/:idChild',
  Children.validateChild,
  Children.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idChild } = req.params;
        const { name } = req.body as IChild;
        const childUpdated = await Children.updateChild(Number(idChild), name);
        if (childUpdated) {
          res.status(200).send('Child updated');
        } else {
          res.status(404).send('Child not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

childrenRouter.delete(
  '/:idChild',
  (req: Request, res: Response, next: NextFunction) => {
    const { idChild } = req.params;
    Children.deleteChild(Number(idChild))
      .then((deletedChild) => {
        if (deletedChild) res.status(201).json(`Child id:${idChild} deleted`);
        else res.status(404).json(`Child id:${idChild} not exist`);
      })
      .catch((err) => next(err));
  }
);

export default childrenRouter;
