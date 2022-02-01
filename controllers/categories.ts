import { Request, Response, NextFunction, Router } from 'express';
import * as Category from '../models/category';
import * as Size from '../models/size';
import ICategory from '../interfaces/ICategory';
import { ErrorHandler } from '../helpers/errors';
import * as Item from '../models/item';

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
        `addresses : 0-${categories.length}/${categories.length + 1}`
      );
      res.status(200).json(categories);
    })
    .catch((err) => next(err));
});

categoriesRouter.get(
  '/:idCategory',
  (req: Request, res: Response, next: NextFunction) => {
    const { idCategory } = req.params;
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
    const { idCategory } = req.params;
    const { id_gender, is_child } = req.query;
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
    const { idCategory } = req.params;
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
        category.id_category = await Category.create(category);
        res.status(201).json(category);
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
        const { idCategory } = req.params;
        const categoryUpdated = await Category.update(
          Number(idCategory),
          req.body as ICategory
        );
        if (categoryUpdated) {
          res.status(200).send('Category updated');
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
        const { idCategory } = req.params;
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
