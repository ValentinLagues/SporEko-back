import { Request, Response, NextFunction, Router } from 'express';
import IClothes from '../interfaces/IClothes';
import * as Clothes from '../models/clothes';

const clothesRouter = Router();

clothesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy = 'id_clothes';
  let order = 'ASC';

  const {
    sort,
    // firstItem,
    // limit
  } = req.query;

  if (sort) {
    const sortToArray = sort.toString().split(' ');
    sortBy = sortToArray[0];
    order = sortToArray[1];
  }

  Clothes.getAllClothes(sortBy, order)
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
});

clothesRouter.get(
  '/:idClothes',
  (req: Request, res: Response, next: NextFunction) => {
    const { idClothes } = req.params;
    Clothes.getClothesById(Number(idClothes))
      .then((result: IClothes) => {
        if (result === undefined)
          res.status(404).send('Error retrieiving data');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

clothesRouter.post(
  '/',
  Clothes.validateClothes,
  Clothes.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    const clothes = req.body as IClothes;
    Clothes.createClothes(clothes)
      .then((createClothes) =>
        res.status(201).json({ id: createClothes, ...req.body })
      )
      .catch((err) => next(err));
  }
);

clothesRouter.put(
  '/:idClothes',
  Clothes.validateClothes,
  Clothes.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idClothes } = req.params;
        const { name } = req.body as IClothes;
        const clothesUpdated = await Clothes.updateClothes(
          Number(idClothes),
          name
        );
        if (clothesUpdated) {
          res.status(200).send('Clothes updated');
        } else {
          res.status(404).send('Clothes not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

clothesRouter.delete(
  '/:idClothes',
  (req: Request, res: Response, next: NextFunction) => {
    const { idClothes } = req.params;
    Clothes.deleteClothes(Number(idClothes))
      .then((deletedClothes) => {
        if (deletedClothes)
          res.status(201).json(`Clothes id:${idClothes} deleted`);
        else res.status(404).json(`Clothes id:${idClothes} not exist`);
      })
      .catch((err) => next(err));
  }
);

export default clothesRouter;
