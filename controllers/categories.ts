const categoriesRouter = require('express').Router();
import { Request, Response } from 'express';
const Category = require('../models/category');

interface CategoryInfo {
  name: string;
}

categoriesRouter.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou categories');
});

///////////// BRANDS ///////////////

categoriesRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send('get all categories');
});

categoriesRouter.get('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  res.status(200).send('get category for id_category ' + idcategory);
});

categoriesRouter.post('/', (req: Request, res: Response) => {
  const category: CategoryInfo = req.body;
  console.log(category.name);
  res.status(200).send('post category');
});

categoriesRouter.put('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  res.status(200).send('put category for id_category ' + idcategory);
});

categoriesRouter.delete('/:idcategory', (req: Request, res: Response) => {
  const { idcategory } = req.params;
  res.status(200).send('delete category for id_category ' + idcategory);
});

///////////// OFFERS BY BRAND //////////////

categoriesRouter.get('/:idbrand/offers', (req: Request, res: Response) => {
  const { idcategory } = req.params;

  //   Session.findByUser(iduser).then((sessions: Array<Object>) =>
  //     res.status(200).json(sessions)
  //   );

  res.status(200).send(`SELECT * 
FROM categories AS c
INNER JOIN offers AS o 
ON c.id_category = o.id_category
AND o.id_category = ${idcategory}`);
});

module.exports = { categoriesRouter };