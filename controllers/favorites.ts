import { Request, Response, NextFunction, Router } from 'express';
import * as Favorite from '../models/favorite';
import IFavorite from '../interfaces/IFavorite';
import { ErrorHandler } from '../helpers/errors';

const favoritesRouter = Router();

favoritesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy = 'id_favorite';
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

  Favorite.getAll(sortBy, order)
    .then((favorites: Array<IFavorite>) => {
      res.status(200).json(favorites);
    })
    .catch((err) => next(err));
});

favoritesRouter.get(
  '/:idFavorite',
  (req: Request, res: Response, next: NextFunction) => {
    const { idFavorite } = req.params;
    Favorite.getById(Number(idFavorite))
      .then((favorite: IFavorite) => {
        if (favorite === undefined) {
          res.status(404).send('Favorite not found');
        }
        res.status(200).json(favorite);
      })
      .catch((err) => next(err));
  }
);

favoritesRouter.post(
  '/',
  Favorite.validateFavorite,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const favorite = req.body as IFavorite;
        favorite.id_favorite = await Favorite.createFavorite(favorite);
        res.status(201).json(favorite);
      } catch (err) {
        next(err);
      }
    })();
  }
);

favoritesRouter.put(
  '/:idFavorite',
  Favorite.validateFavorite,
  (req: Request, res: Response) => {
    void (async () => {
      const { idFavorite } = req.params;

      const favoriteUpdated = await Favorite.update(
        Number(idFavorite),
        req.body as IFavorite
      );
      if (favoriteUpdated) {
        res.status(200).send('Favorite updated');
      } else if (!favoriteUpdated) {
        res.status(404).send('Favorite not found');
      } else {
        throw new ErrorHandler(500, `Favorite can't be updated`);
      }
    })();
  }
);

favoritesRouter.delete(
  '/:idFavorite',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idFavorite } = req.params;
        const favoriteDeleted = await Favorite.destroyFavorite(Number(idFavorite));
        if (favoriteDeleted) {
          res.status(200).send('Favorite deleted');
        } else {
          throw new ErrorHandler(404, `Favorite not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default favoritesRouter;
