import { Request, Response, NextFunction, Router } from 'express';
import * as Shoe from '../models/shoe';
import IShoe from '../interfaces/IShoe';
import { ErrorHandler } from '../helpers/errors';

const shoesRouter = Router();

shoesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_shoe';
  let order: string = 'ASC';

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

  Shoe.getAll(sortBy, order)
    .then((shoes: Array<IShoe>) => {
      res.status(200).json(shoes);
    })
    .catch((err) => next(err));
});

shoesRouter.get(
  '/:idShoe',
  (req: Request, res: Response, next: NextFunction) => {
    const { idShoe } = req.params;
    Shoe.getById(Number(idShoe))
      .then((shoe: IShoe) => {
        if (shoe === undefined) {
          res.status(404).send('Shoe non trouvé');
        }
        res.status(200).json(shoe);
      })
      .catch((err) => next(err));
  }
);

shoesRouter.post(
  '/',
  Shoe.nameIsFree,
  Shoe.validateShoe,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const shoe = req.body as IShoe;
        shoe.id_shoe = await Shoe.create(shoe);
        res.status(201).json(shoe);
      } catch (err) {
        next(err);
      }
    })();
  }
);

shoesRouter.put(
  '/:idshoe',
  Shoe.nameIsFree,
  Shoe.validateShoe,
  (req: Request, res: Response) => {
    void (async () => {
      const { idshoe } = req.params;

      const shoeUpdated = await Shoe.update(Number(idshoe), req.body as IShoe);
      if (shoeUpdated) {
        res.status(200).send('Shoe mis à jour');
      } else if (!shoeUpdated) {
        res.status(404).send('Shoe not found');
      } else {
        throw new ErrorHandler(500, `Ce shoe ne peut pas être mis à jour`);
      }
    })();
  }
);

shoesRouter.delete(
  '/:idshoe',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idshoe } = req.params;
        const shoeDeleted = await Shoe.destroy(Number(idshoe));
        if (shoeDeleted) {
          res.status(200).send('Shoe supprimé');
        } else {
          throw new ErrorHandler(404, `Shoe non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default shoesRouter;
