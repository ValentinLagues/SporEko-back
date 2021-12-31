import { Request, Response, NextFunction, Router } from 'express';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import * as Auth from '../helpers/auth';
import { ErrorHandler } from '../helpers/errors';

const usersRouter = Router();

usersRouter.get(
  '/',
  // Auth.userConnected,
  // Auth.userIsAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    User.getAll()
      .then((user: Array<IUser>) => {
        console.log('getAll ok');
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

usersRouter.get(
  '/:idUser',
  // Auth.userConnected,
  (req: Request, res: Response, next: NextFunction) => {
    const { idUser } = req.params;
    User.getById(Number(idUser))
      .then((user: IUser) => {
        if (user === undefined) {
          res.status(404).send('Utilisateur non trouvé');
        }
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  }
);

usersRouter.post(
  '/',
  // Auth.userConnected,
  User.emailIsFree,
  User.pseudoIsFree,
  User.validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body as IUser;
      user.id_user = await User.create(user);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

usersRouter.put(
  '/:idUser',
  // Auth.userConnected,
  User.recordExists,
  User.emailIsFree,
  User.pseudoIsFree,
  User.validateUser,
  async (req: Request, res: Response) => {
    const { idUser } = req.params;

    const userUpdated = await User.update(Number(idUser), req.body as IUser);
    if (userUpdated) {
      res.status(200).send(req.body);
    } else {
      throw new ErrorHandler(
        500,
        `Cet utilisateur ne peut pas être mis à jour`
      );
    }
  }
);

usersRouter.delete(
  '/:idUser',
  // Auth.userConnected,
  // Auth.userIsAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idUser } = req.params;
      const userDeleted = await User.destroy(Number(idUser));
      if (userDeleted) {
        res.status(200).send('Utilisateur supprimé');
      } else {
        throw new ErrorHandler(404, `Utilisateur non trouvé`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default usersRouter;
