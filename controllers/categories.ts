import { Request, Response, NextFunction, Router } from 'express';
import Category from '../models/category';
import Size from '../models/size';
import ICategory from '../interfaces/ICategory';
import { ErrorHandler } from '../helpers/errors';
import Item from '../models/item';

const categoriesRouter = Router();

categoriesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Category.getAll(sortBy, order, firstItem, limit)
    .then((categories: Array<ICategory>) => {
      res.setHeader(
        'Content-Range',
        `categories : 0-${categories.length}/${categories.length + 1}`
      );
      res.status(200).json(categories);
    })
    .catch((err) => next(err));
});

categoriesRouter.get(
  '/:idCategory',
  (req: Request, res: Response, next: NextFunction) => {
    const idCategory = req.params.idCategory;
    Category.getById(Number(idCategory))
      .then((category: ICategory) => {
        if (category === undefined) {
          res.status(404).send('Category not found');
        }
        res.status(200).json(category);
      })
      .catch((err) => next(err));
  }
);

categoriesRouter.get(
  '/:idCategory/sizes',
  (req: Request, res: Response, next: NextFunction) => {
    const idCategory = req.params.idCategory;
    const id_gender = req.query.id_gender as string;
    const is_child = req.query.is_child as string;
    Size.getSizesByCategory(
      Number(idCategory),
      Number(id_gender),
      Number(is_child)
    )
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((err) => next(err));
  }
);

categoriesRouter.get(
  '/:idCategory/items',
  (req: Request, res: Response, next: NextFunction) => {
    const idCategory = req.params.idCategory;
    Item.getItemsByCategory(Number(idCategory))
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((err) => next(err));
  }
);

categoriesRouter.post(
  '/',
  Category.nameIsFree,
  Category.validateCategory,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const category = req.body as ICategory;
        const idCategory = await Category.create(category);
        res
          .status(201)
          .json({ id_category: idCategory, id: idCategory, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

categoriesRouter.put(
  '/:idCategory',
  Category.nameIsFree,
  Category.validateCategory,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idCategory = req.params.idCategory;
        const categoryUpdated = await Category.update(
          Number(idCategory),
          req.body as ICategory
        );
        if (categoryUpdated) {
          res.status(200).json({ id: idCategory });
        } else {
          res.status(404).send('Category not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

categoriesRouter.delete(
  '/:idCategory',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idCategory = req.params.idCategory;
        const categoryDeleted = await Category.destroy(Number(idCategory));
        if (categoryDeleted) {
          res.status(200).send('Category deleted');
        } else {
          throw new ErrorHandler(404, `Category not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default categoriesRouter;
