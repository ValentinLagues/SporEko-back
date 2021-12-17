import { Request, Response } from 'express';
const gendersRouter = require('express').Router();
const Genders = require('../models/gender')

interface GenderInfo {
  name: string;
}

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
  const  gender: GenderInfo = req.body;
  const joiErrors = Genders.validateGender(gender);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Genders.createGender(gender)
      .then(([createdGender]: Array<any>) => {
        const id = createdGender.insertId;
        res.status(201).json({ id, ...gender });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});
gendersRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Genders.destroyGender(id).then(()=>res
  .status(201).json(`Gender id:${id} supprimé`))
});

gendersRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const gender: GenderInfo = req.body;
  const joiErrors = Genders.validateGender(gender);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
  Genders.updateGender(id,gender).then(([updatedGender]: Array<any>) => { 
    res.status(201).json({ id, ...gender });
  })
  .catch((error: Array<any>) => {
    res.status(500).send(error);
  });
}
});

module.exports = { gendersRouter };