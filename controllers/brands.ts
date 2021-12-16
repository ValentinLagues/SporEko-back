const brandsRouter = require('express').Router();
import { Request, Response } from 'express';
const Brand = require('../models/brand');

interface BrandInfo {
  name: string;
}

brandsRouter.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou brands');
});

///////////// BRANDS ///////////////

brandsRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send('get all brands');
});

brandsRouter.get('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  res.status(200).send('get brand for id_brand ' + idbrand);
});

brandsRouter.post('/', (req: Request, res: Response) => {
  const brand: BrandInfo = req.body;
  console.log(brand.name);
  res.status(200).send('post brand');
});

brandsRouter.put('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  res.status(200).send('put brand for id_brand ' + idbrand);
});

brandsRouter.delete('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  res.status(200).send('delete brand for id_brand ' + idbrand);
});

///////////// OFFERS BY BRAND //////////////

brandsRouter.get('/:idbrand/offers', (req: Request, res: Response) => {
  const { idbrand } = req.params;

  //   Session.findByUser(iduser).then((sessions: Array<Object>) =>
  //     res.status(200).json(sessions)
  //   );

  res.status(200).send(`SELECT * 
FROM brands AS b
INNER JOIN offers AS o 
ON b.id_brand = o.id_brand
AND o.id_brand = ${idbrand}`);
});

module.exports = { brandsRouter };