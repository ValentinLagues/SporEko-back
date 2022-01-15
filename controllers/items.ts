import { Request, Response, NextFunction, Router } from 'express';
import IItem from '../interfaces/IItem';
import * as Item from '../models/item';

const itemsRouter = Router();

itemsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_item';
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

  Item.getAllItem(sortBy, order)
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
});

itemsRouter.get(
  '/:idItem',
  (req: Request, res: Response, next: NextFunction) => {
    const { idItem } = req.params;
    Item.getItemById(Number(idItem))
      .then((result: IItem) => {
        if (result === undefined)
          res.status(404).send('Error retrieiving data');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

itemsRouter.post(
  '/',
  Item.validateItem,
  Item.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    const item = req.body as IItem;
    Item.createItem(item)
      .then((createItem) =>
        res.status(201).json({ id: createItem, ...req.body })
      )
      .catch((err) => next(err));
  }
);

itemsRouter.put(
  '/:idItem',
  Item.validateItem,
  Item.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idItem } = req.params;
        const { name, id_category } = req.body as IItem;
        const itemUpdated = await Item.updateItem(
          Number(idItem),
          name,
          id_category
        );
        if (itemUpdated) {
          res.status(200).send('Item updated');
        } else {
          res.status(404).send('Item not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

itemsRouter.delete(
  '/:idItem',
  (req: Request, res: Response, next: NextFunction) => {
    const { idItem } = req.params;
    Item.deleteItem(Number(idItem))
      .then((deletedItem) => {
        if (deletedItem) res.status(201).json(`Item id:${idItem} deleted`);
        else res.status(404).json(`Item id:${idItem} not exist`);
      })
      .catch((err) => next(err));
  }
);

export default itemsRouter;
