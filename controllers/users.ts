const usersRouter = require('express').Router();
import { Request, Response } from 'express';
const User = require('../models/user');

interface UserInfo {
  lastname: string;
  firstname: string;
  adress: string;
  zipcode: number;
  city: string;
  mail: string;
  hash_password: string;
  picture: string;
  isadmin: number;
  isarchived: number;
  id_gender: number;
  adress_complement: string;
  id_sportif_style: number;
  birthday: string; //c'est type date pour mysql... = string?
  phone: string;
  pseudo: string;
  authentified_by_facebook: number;
}

usersRouter.get('/', (req: Request, res: Response) => {
  User.findManyUser().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

usersRouter.get('/:iduser', (req: Request, res: Response) => {
  const { iduser } = req.params;
  User.findUserById(iduser).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  });
});

usersRouter.post('/', (req: Request, res: Response) => {
  const user: UserInfo = req.body;
  let duplicateData: string = '';
  interface joiErrorsModel {
    details: Array<any>;
  }
  interface errModel {
    message: string;
  }
  let joiErrors: joiErrorsModel;

  Promise.all([
    User.findUserByEmail(user.mail),
    User.findUserByPseudo(user.pseudo),
  ])
    .then(([emailAlreadytaken, pseudoAlreadytaken]) => {
      if (emailAlreadytaken[0].length > 0) {
        duplicateData += 'Cet email existe déjà; ';
      }
      if (pseudoAlreadytaken[0].length > 0) {
        duplicateData += 'Ce pseudo existe déjà; ';
      }
      if (duplicateData) {
        return Promise.reject(duplicateData);
      }

      joiErrors = User.validateUser(user);
      if (joiErrors) {
        return Promise.reject('INVALID_DATA');
      }

      return User.createUser(user);
    })
    .then(([createdUser]: Array<any>) => {
      const id = createdUser.insertId;
      res.status(201).json({ id, ...user });
    })
    .catch((err) => {
      if (err === duplicateData)
        res.status(409).json({ message: duplicateData });
      else if (err === 'INVALID_DATA') {
        const joiDetails: Array<string> = joiErrors.details.map(
          (err: errModel) => {
            return err.message;
          }
        );
        res.status(422).json(joiDetails);
      } else res.status(500).send('erreur d interface chaise-écran');
    });
});

usersRouter.put('/:iduser', (req: Request, res: Response) => {
  const { iduser } = req.params;
  User.findUserById(iduser).then(([userFound]: Array<any>) => {
    if (userFound.length < 1) {
      res.status(404).send('Utilisateur non trouvé');
    } else {
      const user: UserInfo = req.body;

      let duplicateData: string = '';
      interface joiErrorsModel {
        details: Array<any>;
      }
      interface errModel {
        message: string;
      }
      let joiErrors: joiErrorsModel;

      Promise.all([
        User.findUserByEmail(user.mail),
        User.findUserByPseudo(user.pseudo),
      ])
        .then(([emailAlreadytaken, pseudoAlreadytaken]) => {
          if (emailAlreadytaken[0].length > 0) {
            duplicateData += 'Cet email existe déjà; ';
          }
          if (pseudoAlreadytaken[0].length > 0) {
            duplicateData += 'Ce pseudo existe déjà; ';
          }
          if (duplicateData) {
            return Promise.reject(duplicateData);
          }

          joiErrors = User.validateUser(user, false);
          if (joiErrors) {
            return Promise.reject('INVALID_DATA');
          }

          return User.updateUser(iduser, user);
        })
        .then(() => {
          res.status(200).json({ ...userFound[0], ...user });
        })
        .catch((err) => {
          if (err === duplicateData)
            res.status(409).json({ message: duplicateData });
          else if (err === 'INVALID_DATA') {
            const joiDetails: Array<string> = joiErrors.details.map(
              (err: errModel) => {
                return err.message;
              }
            );
            res.status(422).json(joiDetails);
          } else res.status(500).send('erreur d interface chaise-écran');
        });
    }
  });
});

usersRouter.delete('/:iduser', (req: Request, res: Response) => {
  const { iduser } = req.params;
  User.findUserById(iduser).then(([userFound]: Array<any>) => {
    if (userFound.length > 0) {
      User.destroyUser(iduser).then(() => {
        res.status(200).send('Utilisateur supprimé');
      });
    } else {
      res.status(404).send('Utilisateur non trouvé (vérif id)');
    }
  });
});

module.exports = { usersRouter };
