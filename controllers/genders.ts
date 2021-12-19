import { Request, Response } from 'express';
const gendersRouter = require('express').Router();
const Genders = require('../models/gender')

interface GenderInfo {
  name: string;
}

gendersRouter.get('/', (req: Request, res: Response) => {
  Genders.findManyGenders().then(([result]: Array<any>) => {
    res.status(200).json(result);
  }).catch((err: Error) => {
    console.log(err)
    res.status(500).send('Erreur impossible de trouvé genders dans la base de donnée');
  });
});

gendersRouter.get('/:id', (req: Request, res: Response) => {

  const { id } = req.params;
  Genders.findOneGender(id).
    then(([result]: Array<any>) => {
      if (result[0]) res.status(200).json(result[0]);
      else res.status(404).json(`Gender id:${id} n'existe pas dans la base de données`)
    }).catch((err: Error) => {
      console.log(err)
      res.status(500).send('Erreur impossible de trouvé gender dans la base de donnée');
    });
});

gendersRouter.post('/', (req: Request, res: Response) => {
  const gender: GenderInfo = req.body;
  const joiErrors = Genders.validateGender(gender);
  
      Genders.createGender(gender)
        .then(([createdGender]: Array<any>) => {
          const id = createdGender.insertId;
          res.status(201).json({ id, ...gender });
        })
        .catch((error: Array<any>) => {
          res.status(500).send(error);
          res.status(422).send(joiErrors.details);
        });
});

gendersRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Genders.destroyGender(id).then((result: Array<any>) => {
    if (result[0].affectedRows) res.status(201).json(`Gender id:${id} supprimé`)
    else res.status(404).json(`Gender id:${id} n'existe pas`)
  })
});

gendersRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const gender: GenderInfo = req.body;
  const joiErrors = Genders.validateGender(gender);
  if (joiErrors) res.status(422).json(joiErrors.message);
   else Genders.updateGender(id, gender).then(() =>  res.status(201).json({ id_gender: id, ...gender }))
  .catch((error: Array<any>) => {
    res.status(500).send(error);
  });

});

module.exports = { gendersRouter };