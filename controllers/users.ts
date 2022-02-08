import { Request, Response, NextFunction, Router } from 'express';
import User from '../models/user';
import Offer from '../models/offer';
import Favorite from '../models/favorite';
import IUser from '../interfaces/IUser';
import Auth from '../helpers/auth';
import { ErrorHandler } from '../helpers/errors';
import IFavorite from '../interfaces/IFavorite';

const usersRouter = Router();

usersRouter.get(
  '/',
  Auth.userConnected,
  Auth.userIsAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const firstItem = req.query.firstItem as string;
    const limit = req.query.limit as string;

    User.getAll(sortBy, order, firstItem, limit)
      .then((users: Array<IUser>) => {
        res.setHeader(
          'Content-Range',
          `users : 0-${users.length}/${users.length + 1}`
        );
        res.status(200).json(users);
      })
      .catch((err) => next(err));
  }
);

usersRouter.get(
  '/:idUser',
  (req: Request, res: Response, next: NextFunction) => {
    const idUser = req.params.idUser;
    User.getById(Number(idUser))
      .then((user: IUser) => {
        if (user === undefined) {
          res.status(404).send('User not found');
        }
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

usersRouter.get(
  '/:idUser/favorites',
  (req: Request, res: Response, next: NextFunction) => {
    const idUser = req.params.idUser;
    Favorite.getFavoritesByUser(Number(idUser))
      .then((favorites) => res.status(200).json(favorites))
      .catch((err) => next(err));
  }
);

usersRouter.get(
  '/:idUser/offers',

  (req: Request, res: Response, next: NextFunction) => {
    const idUser = req.params.idUser;
    Offer.getOffersByIdUser(Number(idUser))
      .then((user) => {
        if (user === undefined) {
          res.status(404).send('User not found');
        }
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

usersRouter.post(
  '/',
  User.emailIsFree,
  User.pseudoIsFree,
  User.validateUser,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const user = req.body as IUser;
        user.id_user = await User.create(user);
        res.status(201).json(user);
      } catch (err) {
        next(err);
      }
    })();
  }
);

usersRouter.post(
  '/:idUser/favorites',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const favorite = req.body as IFavorite;
        favorite.id_favorite = await Favorite.create(favorite);
        res.status(201).json(favorite);
      } catch (err) {
        next(err);
      }
    })();
  }
);

usersRouter.put(
  '/:idUser/image',
  Auth.userConnected,
  User.upload.single('imageUser'),
  (req: Request, res: Response) => {
    void (async () => {
      const path = req.file?.originalname.split('.') || [];
      const idUser = req.params.idUser;
      const picture = `${req.protocol}://${req.get('host')}/imageUser/${
        req.params.id
      }.${path[1]}`;
      const userUpdated = await User.updateImage(Number(idUser), picture);
      if (userUpdated) {
        res.status(200).send({ picture: picture, ...req.file });
      } else {
        throw new ErrorHandler(500, `Image can't be updated`);
      }
    })();
  }
);

usersRouter.put(
  '/:idUser',
  Auth.userConnected,
  User.recordExists,
  User.emailIsFree,
  User.pseudoIsFree,
  User.validateUser,
  (req: Request, res: Response) => {
    void (async () => {
      const idUser = req.params.idUser;
      const user = req.body as IUser;

      // as react-admin send all fields even when nothing has changed -> that prevent from hashing again the hash_password (would make user unable to connect)
      if (user.hash_password?.includes('$argon2')) {
        user.hash_password = '';
      }

      const userUpdated = await User.update(Number(idUser), user);
      if (userUpdated) {
        res.status(200).send(user);
      } else {
        throw new ErrorHandler(500, `User can't be updated`);
      }
    })();
  }
);

usersRouter.delete(
  '/:idUser/favorites/:idFavorite',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idFavorite = req.params.idFavorite;
        const favoriteDeleted = await Favorite.destroyFavorite(
          Number(idFavorite)
        );
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

usersRouter.delete(
  '/:idUser',
  Auth.userConnected,
  Auth.userIsAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idUser = req.params.idUser;
        const userDeleted = await User.destroy(Number(idUser));
        if (userDeleted) {
          res.status(200).send('User deleted');
        } else {
          throw new ErrorHandler(404, `User not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default usersRouter;
