import { Request, Response } from 'express';
const categoriesRouter = require('express').Router();
const Categories = require('../models/category')


categoriesRouter.get('/', (req: Request, res: Response) => {
  Categories.findManyCategories().then(([result]:Array<any>) => {
    res.status(200).json(result);
  })
  .catch((error : Array<any>) => { 
    console.log(error); 
  res.status(501).send('Error finding categories')
})
});

categoriesRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  Categories.findOneCategory(id).then(([result]:Array<any>) => {
    if ([result]) {
      res.status(200).json([result]); }
      else {
  res.status(404).send('Category not found')
}})
.catch((error: Array<any>) => {
  console.log(error)
  res.status(501).send('Error finding the category');
})
});

categoriesRouter.post('/', (req: Request, res: Response) => {
  const { name } = req.body;
  const joiErrors = Categories.validateCategory(name);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Categories.createCategory(name).then((createdCategory: object) => {
      res.status(200).json(createdCategory);
    })
      .catch((error: Array<any>) => {
        console.log(error)
        res.status(501).send('Error creating the category')
      })
  }
});

categoriesRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const { name } = req.body;
  Categories.updateCategory(id, name).then(()=>res
  .status(201).json(`Brand id:${id} successfully updated`))
  .catch((error:Array<any>) => {
    console.log(error)
    res.status(501).send('Error updating a brand')
  })
});

categoriesRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Categories.destroyCategory(id)
  .then((deleted : Array<any>) => {
    if (deleted) res.status(201).json(`Category id:${id} successfully deleted`);
    else res.status(404).send('Category not found')
})
.catch((error : Array<any>) => {
  console.log(error);
  res.status(501).send('Error deleting the category')
})
});

module.exports = { categoriesRouter };