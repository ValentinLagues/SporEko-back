const categoriesRouter = require('express').Router();
import { Request, Response } from 'express';
const Category = require('../models/category');

interface CategoryInfo {
  name: string;
}

categoriesRouter.get('/', (req: Request, res: Response) => {
  Category.findManyCategories().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

categoriesRouter.get('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  Category.findOneCategory(idcategory).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Category not found');
    }
  });
});

categoriesRouter.post('/', (req: Request, res: Response) => {
  const category: CategoryInfo = req.body;
  const joiErrors = Category.validateCategory(category);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Category.createCategory(category)
      .then(([createdCategory]: Array<any>) => {
        const id = createdCategory.insertId;
        res.status(201).json({ id, ...category });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

categoriesRouter.put('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  Category.findOneCategory(idcategory).then(([categoryFound]: Array<any>) => {
    if (categoryFound.length > 0) {
      const category: CategoryInfo = req.body;
      const joiErrors = Category.validateCategory(category, false);
      if (joiErrors) {
        console.log('JoiErrors dans put category');
        res.status(409).send(joiErrors.details);
      } else {
        Category.updateCategory(idcategory, category).then(() => {
          res.status(200).json({ ...categoryFound[0], ...category });
        });
      }
    } else {
      res.status(404).send('Category not found');
    }
  });
});

categoriesRouter.delete('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  Category.findOneCategory(idcategory).then(([categoryFound]: Array<any>) => {
    if (categoryFound.length > 0) {
      Category.destroyCategory(idcategory).then(() => {
        res.status(200).send('Category successfully deleted');
      });
    } else {
      res.status(404).send('Category not found');
    }
  });
});

module.exports = { categoriesRouter };