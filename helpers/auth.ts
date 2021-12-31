import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IUserInfo from '../interfaces/IUserInfo';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const calculateToken = (
  userPseudo = '',
  userPicture = '',
  userId = 0,
  userIsAdmin = 0
) => {
  return jwt.sign(
    { pseudo: userPseudo, avatar: userPicture, id: userId, admin: userIsAdmin },
    process.env.PRIVATE_KEY as string
  );
};

interface ICookie {
  user_token: string;
}

const userConnected = (req: Request, res: Response, next: NextFunction) => {
  const myCookie = req.cookies as ICookie;
  console.log('dans userConnected');
  console.log(req.cookies);
  console.log(req);
  if (!myCookie.user_token) {
    console.log('pas de token ds cookie');
    next(
      new ErrorHandler(401, 'Utilisateur non reconnu, veuillez vous connecter')
    );
  } else {
    console.log('cookie');
    req.userInfo = jwt.verify(
      myCookie.user_token,
      process.env.PRIVATE_KEY as string
    ) as IUserInfo;
    if (req.userInfo === undefined) {
      console.log('cookie -> pb vérif token');
      next(
        new ErrorHandler(
          401,
          'Utilisateur non reconnu, veuillez vous connecter'
        )
      );
    } else {
      console.log('fin userConnected');
      next();
    }
  }
};

const userIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log('dans userIsAdmin');
  if (req.userInfo === undefined || !req.userInfo.admin) {
    next(new ErrorHandler(403, 'Utilisateur non autorisé'));
  } else {
    console.log('fin userIsAdmin');
    next();
  }
};

export { calculateToken, userConnected, userIsAdmin };
