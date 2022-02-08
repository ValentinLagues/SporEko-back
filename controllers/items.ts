import { Request, Response, NextFunction, Router } from 'express';
import IItem from '../interfaces/IItem';
import Size from '../models/size';
import Item from '../models/item';

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
        `items : 0-${items.length}/${items.length + 1}`
      );
      res.status(200).json(items);
    })
    .catch((err) => next(err));
});

itemsRouter.get(
  '/:idItem',
  (req: Request, res: Response, next: NextFunction) => {
    const idItem = req.params.idItem;
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
    const idItem = req.params.idItem;
    const id_gender = req.query.id_gender as string;
    const is_child = req.query.is_child as string;
    Item.getItemById(Number(idItem))
      .then((item) =>
        Size.getSizesBySizeType( 
          Number(item.id_size_type),
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
    void (async () => {
      try {
        const item = req.body as IItem;
        const idItem = await Item.create(item);
        res.status(201).json({ id_item: idItem, id: idItem, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

itemsRouter.put(
  '/:idItem',
  Item.validateItem,
  Item.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idItem = req.params.idItem;
        const { name, id_category, id_sizeType } = req.body as IItem;
        const itemUpdated = await Item.updateItem(
          Number(idItem),
          name,
          id_category,
          id_sizeType
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
    const idItem = req.params.idItem;
    Item.deleteItem(Number(idItem))
      .then((deletedItem) => {
        if (deletedItem) res.status(201).json(`Item id:${idItem} deleted`);
        else res.status(404).json(`Item id:${idItem} not exist`);
      })
      .catch((err) => next(err));
  }
);

export default itemsRouter;
