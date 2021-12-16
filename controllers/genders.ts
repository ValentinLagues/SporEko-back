import { Request, Response } from 'express';
const gendersRouter = require('express').Router();
const Genders = require('../models/gender')


gendersRouter.get('/', (req: Request, res: Response) => {
  Genders.findManyGenders().then(([result]:Array<any>) => {
    res.status(200).json(result);
  });
});

gendersRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  Genders.findOneGender(id).then(([result]:Array<any>)=>res
  .status(200).json(result))
});

gendersRouter.post('/', (req: Request, res: Response) => {
  const  name  = req.body;
  const joiErrors = Genders.validateGender(name);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Genders.createGender(name).then((createdGender: object) => {
      res.status(200).json(createdGender);
    })
      .catch((error: Array<any>) => {
        console.log(error);
      })
  };
})
gendersRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Genders.destroyGender(id).then(()=>res
  .status(201).json(`Gender id:${id} supprimé`))
});

gendersRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const { name } = req.body;
  Genders.updateGender(id,name).then(()=>res
  .status(201).json(`Gender id:${id} a bien était mis a jour`))
});

module.exports = { gendersRouter };