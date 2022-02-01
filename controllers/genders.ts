import { Request, Response, NextFunction, Router } from 'express';
import IGender from '../interfaces/IGender';
import * as Genders from '../models/gender';

const gendersRouter = Router();

gendersRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Genders.getAllGenders(sortBy, order, firstItem, limit)
    .then((genders) => {
      res.setHeader(
        'Content-Range',
        `addresses : 0-${genders.length}/${genders.length + 1}`
      );
      res.status(200).json(genders);
    })
    .catch((err) => next(err));
});

gendersRouter.get(
  '/:idGender',
  (req: Request, res: Response, next: NextFunction) => {
    const { idGender } = req.params;
    Genders.getGenderById(Number(idGender))
      .then((result: IGender) => {
        if (result === undefined)
          res.status(404).send('Error retrieiving data');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

gendersRouter.post(
  '/',
  Genders.validateGender,
  (req: Request, res: Response, next: NextFunction) => {
    const gender = req.body as IGender;
    Genders.createGender(gender)
      .then((createGender) =>
        res.status(201).json({ id: createGender, ...req.body })
      )
      .catch((err) => next(err));
  }
);

gendersRouter.put(
  '/:idGender',
  Genders.validateGender,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idGender } = req.params;
        const { adult_name, child_name } = req.body as IGender;
        const genderUpdated = await Genders.updateGender(
          Number(idGender),
          adult_name,
          child_name
        );
        if (genderUpdated) {
          res.status(200).send('Gender updated');
        } else {
          res.status(404).send('Gender not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

gendersRouter.delete(
  '/:idGender',
  (req: Request, res: Response, next: NextFunction) => {
    const { idGender } = req.params;
    Genders.deleteGender(Number(idGender))
      .then((deletedGender) => {
        if (deletedGender)
          res.status(201).json(`Gender id:${idGender} deleted`);
        else res.status(404).json(`Gender id:${idGender} not exist`);
      })
      .catch((err) => next(err));
  }
);

export default gendersRouter;
