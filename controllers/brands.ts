import { Request, Response } from 'express';
const brandsRouter = require('express').Router();
const Brands = require('../models/brand')


brandsRouter.get('/', (req: Request, res: Response) => {
  Brands.findManyBrands().then(([result]:Array<any>) => {
    res.status(200).json(result);
  })
  .catch((error : Array<any>) => { 
    console.log(error); 
  res.status(501).send('Error finding brands')
})
});

brandsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  Brands.findOneBrand(id).then(([result]:Array<any>) => {
    if ([result]) {
      res.status(200).json([result]); }
      else {
  res.status(404).send('Brand not found')
}})
.catch((error: Array<any>) => {
  console.log(error)
  res.status(501).send('Error finding the brand');
})
});

brandsRouter.post('/', (req: Request, res: Response) => {
  const { name } = req.body;
  const joiErrors = Brands.validateBrand(name);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Brands.createBrand(name).then((createdBrand: object) => {
      res.status(200).json(createdBrand);
    })
      .catch((error: Array<any>) => {
        console.log(error)
        res.status(501).send('Error creating the brand')
      })
  }
});

brandsRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const { name } = req.body;
  Brands.updateBrand(id, name).then(()=>res
  .status(201).json(`Brand id:${id} successfully updated`))
  .catch((error:Array<any>) => {
    console.log(error)
    res.status(501).send('Error updating a brand')
  })
});

brandsRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Brands.destroyBrand(id)
  .then((deleted : Array<any>) => {
    if (deleted) res.status(201).json(`Brand id:${id} successfully deleted`);
    else res.status(404).send('Brand not found')
})
.catch((error : Array<any>) => {
  console.log(error);
  res.status(501).send('Error deleting the brand')
})
});

module.exports = { brandsRouter };