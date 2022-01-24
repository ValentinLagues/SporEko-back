import { Request, Response, NextFunction, Router } from 'express';
import * as User from '../models/user';
import IUser from '../interfaces/IUser';
import { ErrorHandler } from '../helpers/errors';
import { calculateToken } from '../helpers/auth';

const authRouter = Router();

authRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as IUser;
    User.getByEmail(email)
      .then(async (user) => {
        if (!user) throw new ErrorHandler(401, 'Email or password incorrect');
        else {
          const passwordIsCorrect: boolean = await User.verifyPassword(
            password,
            user.hash_password
          );
          if (passwordIsCorrect) {
            const token = calculateToken(
              user.pseudo,
              user.picture,
              Number(user.id_user),
              Number(user.is_admin)
            );
            res.cookie('user_token', token, {
              secure: false,
            });
            res.json({
              id: user.id_user,
              pseudo: user.pseudo,
              picture: user.picture,
<<<<<<< HEAD
              admin: Number(user.is_admin),
=======
              admin: user.is_admin,
>>>>>>> b254e4b7334a4087ccb58fb6ce06b1c35da41ccd
            });
          } else throw new ErrorHandler(401, 'Email or password incorrect');
        }
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

export default authRouter;
