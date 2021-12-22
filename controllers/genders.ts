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

gendersRouter.delete('/:id', (req: Request, res: Response) => {
  const { idGender } = req.params;
  Genders.destroyGender(Number(idGender)).then((result: Array<any>) => {
    if (result[0].affectedRows)
      res.status(201).json(`Gender id:${idGender} supprimé`);
    else res.status(404).json(`Gender id:${idGender} n'existe pas`);
  });
});

export default gendersRouter;
