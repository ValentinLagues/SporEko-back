import { Request, Response, NextFunction, Router } from 'express';
import IGender from '../interfaces/IGender';
import * as Genders from '../models/gender';
import { ErrorHandler } from '../helpers/errors';

const gendersRouter = Router();

gendersRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  void(async () => {
    try {
      const results = await Genders.getAllGenders();
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  })();
});

gendersRouter.get(
  '/:idGender',
  (req: Request, res: Response, next: NextFunction) => {
    void(async () => {
      try {
        const { idGender } = req.params;
        const gender = await Genders.getGenderById(Number(idGender));
        if (gender) 
        return res.status(200).json(gender);
        else
          return res.status(404).send(`Le genre avec id:${idGender} est introuvable.`);
      } catch (err) {
        next(err);
      }
    }) ();
  }
);

gendersRouter.post(
  '/',
  Genders.nameIsFree,
  Genders.validateGender,
  (req: Request, res: Response, next: NextFunction) => {
    async () => {
      try {
        const gender = req.body as IGender;
        gender.id_gender = await Genders.createGender(gender);
        res.status(201).json(gender);
      } catch (err) {
        next(err);
      }
    };
  }
);

gendersRouter.put(
  '/:idGender',
  Genders.nameIsFree,
  Genders.validateGender,
  (req: Request, res: Response) => {
    async () => {
      const { idGender } = req.params;
      const { name } = req.body as IGender;
      const genderUpdated = await Genders.updateGender(Number(idGender), name);
      if (genderUpdated) {
        res.status(200).send('Genre mis à jour');
      } else {
        throw new ErrorHandler(500, `Genre ne peut pas être mis à jour`);
      }
    };
  }
);

gendersRouter.delete('/:idGender', (req: Request, res: Response) => {
  async () => {
    const { idGender } = req.params;
    const deletedId = await Genders.destroyGender(Number(idGender));
    if (deletedId)
      res.status(201).json(`Le genre avec l'id:${idGender} à été supprimé`);
    else res.status(404).json(`Le genre avec l'id:${idGender} n'existe pas`);
  };
});

export default gendersRouter;