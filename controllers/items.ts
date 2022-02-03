import { Request, Response, NextFunction, Router } from 'express';
import IItem from '../interfaces/IItem';
import * as Size from '../models/size';
import * as Item from '../models/item';

const itemsRouter = Router();

itemsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Item.getAllItem(sortBy, order, firstItem, limit)
    .then((items: Array<IItem>) => {
      res.setHeader(
        'Content-Range',
        `addresses : 0-${items.length}/${items.length + 1}`
      );
      res.status(200).json(items);
    })
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

itemsRouter.get(
  '/:idItem/sizes',
  (req: Request, res: Response, next: NextFunction) => {
    const { idItem } = req.params;
    const { id_gender, is_child } = req.query;
    Item.getItemById(Number(idItem))
      .then((item) =>
        Size.getSizesBySizeType(
          item.id_size_type,
          Number(id_gender),
          Number(is_child)
        )
      )
      .then((results) => {
        res.status(200).json(results);
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
        const { name, id_category, id_size_type } = req.body as IItem;
        const itemUpdated = await Item.updateItem(
          Number(idItem),
          name,
          id_category,
          id_size_type
        );
        if (itemUpdated) {
          res.status(200).json({ id: idItem });
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
