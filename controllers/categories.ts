import { Request, Response, NextFunction, Router } from 'express';
import * as Category from '../models/category';
import ICategory from '../interfaces/ICategory';
import { ErrorHandler } from '../helpers/errors';

const categoriesRouter = Router();

categoriesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Category.getAll()
    .then((categories: Array<ICategory>) => {
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
          res.status(404).send('Categorie non trouvée');
        }
        res.status(200).json(category);
      })
      .catch((err) => next(err));
  }
);

categoriesRouter.post(
  '/',
  Category.nameIsFree,
  Category.validateCategory,
  (req: Request, res: Response, next: NextFunction) => {
    async () => {
    try {
      const category = req.body as ICategory;
      category.id_category = await Category.create(category);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
  }
);

categoriesRouter.put(
  '/:idCategory',
  Category.nameIsFree,
  Category.validateCategory,
  (req: Request, res: Response) => {
    async () => {
    const { idCategory } = req.params;
    const categoryUpdated = await Category.update(
      Number(idCategory),
      req.body as ICategory
    );
    if (categoryUpdated) {
      res.status(200).send('Categorie mise à jour');
    } else {
      throw new ErrorHandler(500, `Cette categorie ne peut pas être mise à jour`);
    }
  }
  }
);

categoriesRouter.delete(
  '/:idCategory',
  (req: Request, res: Response, next: NextFunction) => {
    async () => {
    try {
      const { idCategory } = req.params;
      const categoryDeleted = await Category.destroy(Number(idCategory));
      if (categoryDeleted) {
        res.status(200).send('Categorie supprimée');
      } else {
        throw new ErrorHandler(404, `Categorie non trouvée`);
      }
    } catch (err) {
      next(err);
    }
  }
  }
);

export default categoriesRouter;