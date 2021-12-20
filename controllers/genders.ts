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
  let duplicateData: string = '';
  interface joiErrorsModel {
    details: Array<any>;
  }
  interface errModel {
    message: string;
  }
  let joiErrorsGender: joiErrorsModel;
  Promise.all([
    Genders.findByGenderName(gender.name),
  ])
    .then(([nameAllreadyExist]) => {
      if (nameAllreadyExist[0].length > 0) {
        duplicateData += 'Ce genre existe déjà; ';
      }
      if (duplicateData) {
        return Promise.reject(duplicateData);
      }
      const joiErrorsGender = Genders.validateGender(gender);
      if (joiErrorsGender) {
        return Promise.reject('INVALID_DATA');
      }
      return  Genders.createGender(gender)
    })
        .then(([createdGender]: Array<any>) => {
          const id = createdGender.insertId;
          res.status(201).json({ id, ...gender });
        })
        .catch((error) => {
          if (error === duplicateData)
            res.status(409).json({ message: duplicateData });
          else if (error === 'INVALID_DATA') {
            const joiDetails: Array<string> = joiErrorsGender.details.map(
              (error: errModel) => {
                console.log(error);
                return error.message;
              })
            res.status(422).send(joiErrorsGender.details);
          }else res.status(500).send(error);
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
  Genders.findOneGender(id).then(([genderFound]: Array<any>) => {
    if (genderFound.length < 1) {
      res.status(404).send('Genre non trouvé');
    } else {
      const gender: GenderInfo = req.body;

      let duplicateData: string = '';
      interface joiErrorsModel {
        details: Array<any>;
      }
      interface errModel {
        message: string;
      }
      let joiErrorsGender: joiErrorsModel;
      Promise.all([
        Genders.findByGenderName(gender.name),
      ])
        .then(([nameAllreadyExist]) => {
          if (nameAllreadyExist[0].length > 0) {
            duplicateData += 'Ce genre existe déjà; ';
          }
          if (duplicateData) {
            return Promise.reject(duplicateData);
          }
          const joiErrorsGender = Genders.validateGender(gender,false);
          if (joiErrorsGender) {
            return Promise.reject('INVALID_DATA');
          }
          return Genders.updateGender(id, gender)
        })
        .then(() => res.status(201).json({ ...genderFound[0], ...gender }))
        .catch((error) => {
          if (error === duplicateData)
            res.status(409).json({ message: duplicateData });
          else if (error === 'INVALID_DATA') {
            const joiDetails: Array<string> = joiErrorsGender.details.map(
              (error: errModel) => {
                console.log(error);
                return error.message;
              })
            res.status(422).send(joiErrorsGender.details);
          } else res.status(500).send(error);
        });
      }
    });
});

module.exports = { gendersRouter };