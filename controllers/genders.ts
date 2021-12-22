import { Request, Response, NextFunction } from 'express';
const gendersRouter = require('express').Router();
import IGender from '../interfaces/IGender';
import * as Genders from '../models/gender';
import { ErrorHandler } from '../helpers/errors';

gendersRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    Genders.getAllGenders().then(([result]: Array<IGender>) =>
      res.status(200).json(result)
    );
  } catch (err) {
    next(err);
  }
});

<<<<<<< HEAD
gendersRouter.post('/', (req: Request, res: Response) => {
  const gender: GenderInfo = req.body;
  let duplicateData = '';
  interface joiErrorsModel {
    details: Array<any>;
=======
gendersRouter.get(
  '/:idGender',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idGender } = req.params;
      Genders.getGenderById(Number(idGender)).then(
        ([result]: Array<Array<IGender>>) => {
          if (result[0]) res.status(200).json(result[0]);
          else
            res
              .status(404)
              .send(`Gender id:${idGender} n'est pas dans la base de donnée.`);
        }
      );
    } catch (err) {
      next(err);
    }
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
  }
);

gendersRouter.post(
  '/',
  Genders.nameIsFree,
  Genders.validateGender,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gender = req.body as IGender;
      gender.id_gender = await Genders.createGender(gender);
      res.status(201).json(gender);
    } catch (err) {
      next(err);
    }
  }
);

gendersRouter.put(
  '/:idGender',
  Genders.nameIsFree,
  Genders.validateGender,
  async (req: Request, res: Response) => {
    const { idGender } = req.params;
    const genderUpdated = await Genders.updateGender(
      Number(idGender),
      req.body
    );
    if (genderUpdated) {
      res.status(200).send('Genre mis à jour');
    } else {
      throw new ErrorHandler(500, `User cannot be updated`);
    }
  }
);

<<<<<<< HEAD
      let duplicateData = '';
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
=======
gendersRouter.delete('/:id', (req: Request, res: Response) => {
  const { idGender } = req.params;
  Genders.destroyGender(Number(idGender)).then((result: Array<any>) => {
    if (result[0].affectedRows)
      res.status(201).json(`Gender id:${idGender} supprimé`);
    else res.status(404).json(`Gender id:${idGender} n'existe pas`);
  });
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
});

export default gendersRouter;
