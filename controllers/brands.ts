const brandsRouter = require('express').Router();
import { Request, Response } from 'express';
const Brands = require('../models/brand');

interface BrandInfo {
  name: string;
}

brandsRouter.get('/', (req: Request, res: Response) => {
  Brands.findManyBrands().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

brandsRouter.get('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  Brands.findOneBrand(idbrand).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Brand not found');
    }
  });
});

brandsRouter.post('/', (req: Request, res: Response) => {
  const brand: BrandInfo = req.body;
  const joiErrors = Brands.validateBrand(brand);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Brands.createBrand(brand)
      .then(([createdBrand]: Array<any>) => {
        const id = createdBrand.insertId;
        res.status(201).json({ id, ...brand });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

brandsRouter.put('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  Brands.findOneBrand(idbrand).then(([brandFound]: Array<any>) => {
    if (brandFound.length > 0) {
      const brand: BrandInfo = req.body;
      const joiErrors = Brands.validateBrand(brand, false);
      if (joiErrors) {
        console.log('JoiErrors dans put brand');
        res.status(409).send(joiErrors.details);
      } else {
        Brands.updateBrand(idbrand, brand).then(() => {
          res.status(200).json({ ...brandFound[0], ...brand });
        });
      }
    } else {
      res.status(404).send('Brand not found');
    }
  });
});

brandsRouter.delete('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  Brands.findOneBrand(idbrand).then(([brandFound]: Array<any>) => {
    if (brandFound.length > 0) {
      Brands.destroyBrand(idbrand).then(() => {
        res.status(200).send('Brand successfully deleted');
      });
    } else {
      res.status(404).send('Brand not found');
    }
  });
});

module.exports = { brandsRouter };