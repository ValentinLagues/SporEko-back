import { Request, Response, NextFunction, Router } from 'express';
import IGender from '../interfaces/IGender';
import * as Genders from '../models/gender';
import { ErrorHandler } from '../helpers/errors';

const gendersRouter = Router();

gendersRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const { gender } = req.body;
      await Genders.getAllGenders().then(([result]) =>
        res.status(200).json(result)
      );
      // return gender;
    } catch (err) {
      next(err);
    }
  }
);

gendersRouter.get(
  '/:idGender',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idGender } = req.params;
      Genders.getGenderById(Number(idGender)).then(([gender]) => {
        if (gender[0]) res.status(200).json(gender[0]);
        else
          res.status(404).send(`Le genre avec id:${idGender} est introuvable.`);
      });
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
      req.body as IGender
    );
    if (genderUpdated) {
      res.status(200).send('Genre mis à jour');
    } else {
      throw new ErrorHandler(500, `Genre ne peut pas être mis à jour`);
    }
  }
);

gendersRouter.delete('/:idGender', (req: Request, res: Response) => {
  const { idGender } = req.params;
  Genders.destroyGender(Number(idGender)).then((result: Array<any>) => {
    if (result[0].affectedRows)
      res.status(201).json(`Le genre avec l'id:${idGender} à été supprimé`);
    else res.status(404).json(`Le genre avec l'id:${idGender} n'existe pas`);
  });
});

export default gendersRouter;
