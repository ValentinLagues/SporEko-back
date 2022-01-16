import { Request, Response, NextFunction, Router } from 'express';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import * as Auth from '../helpers/auth';
import { ErrorHandler } from '../helpers/errors';

const usersRouter = Router();

usersRouter.get(
  '/',
  Auth.userConnected,
  Auth.userIsAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    let sortBy = 'id_user';
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

    User.getAll(sortBy, order)
      .then((user: Array<IUser>) => {
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

usersRouter.get(
  '/:idUser',
  Auth.userConnected,
  (req: Request, res: Response, next: NextFunction) => {
    const { idUser } = req.params;
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

usersRouter.put(
  '/image/:id',
  Auth.userConnected,
  User.upload.single('images'),
  (req: Request, res: Response) => {
    void (async () => {
      const idUser = req.params.id;
      const picture = `${req.protocol}://${req.get('host')}/images/${
        req.file?.filename
      }`;
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
      const { idUser } = req.params;
      const userUpdated = await User.update(Number(idUser), req.body as IUser);
      if (userUpdated) {
        res.status(200).send(req.body);
      } else {
        throw new ErrorHandler(500, `User can't be updated`);
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
        const { idUser } = req.params;
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
