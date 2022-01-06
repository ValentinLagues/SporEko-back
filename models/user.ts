import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import argon2, { Options } from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IUser from '../interfaces/IUser';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_user: Joi.number(),
    lastname: Joi.string().max(255).presence(presence),
    firstname: Joi.string().max(255).presence(presence),
    adress: Joi.string().max(255).presence(presence),
    zipcode: Joi.number().integer().max(99999).presence(presence),
    city: Joi.string().max(255).presence(presence),
    email: Joi.string().max(255).presence(presence),
    password: Joi.string().min(8).max(100).presence(presence),
    picture: Joi.string().max(255),
    isadmin: Joi.number().integer().min(0).max(1).presence(presence),
    isarchived: Joi.number().integer().min(0).max(1).presence(presence),
    id_gender: Joi.number().integer().min(1).presence(presence),
    adress_complement: Joi.string().max(255),
    id_athletic: Joi.number().integer().min(1),
    birthday: Joi.string().max(50).presence(presence),
    phone: Joi.string().max(14).presence(presence),
    creation_date: Joi.string(),
    pseudo: Joi.string().max(25).presence(presence),
    authentified_by_facebook: Joi.number()
      .integer()
      .min(0)
      .max(1)
      .presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const recordExists = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const user = req.body as IUser;
    user.id_user = parseInt(req.params.idUser);
    const recordFound: IUser = await getById(user.id_user);
    if (!recordFound) {
      next(new ErrorHandler(404, `Utilisateur non trouvé`));
    } else {
      next();
    }
  })();
};
const emailIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const user = req.body as IUser;
    const userWithSameEmail: IUser = await getByEmail(user.email);
    if (userWithSameEmail) {
      next(new ErrorHandler(409, `Cet email existe déjà`));
    } else {
      next();
    }
  })();
};
const pseudoIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const user = req.body as IUser;
    const userWithSamePseudo: IUser = await getByPseudo(user.pseudo);
    if (userWithSamePseudo) {
      next(new ErrorHandler(409, `Ce pseudo existe déjà`));
    } else {
      next();
    }
  })();
};

const hashingOptions: Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, hashingOptions);
};

const verifyPassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return argon2.verify(hashedPassword, password, hashingOptions);
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = async (): Promise<IUser[]> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users')
    .then(([results]) => results);
};

const getById = async (idUser: number): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE id_user = ?', [idUser])
    .then(([results]) => results[0]);
};

const getByEmail = async (email: string): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE email = ?', [email])
    .then(([results]) => results[0]);
};

const getByPseudo = async (pseudo: string): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE pseudo = ?', [pseudo])
    .then(([results]) => results[0]);
};

const create = async (newUser: IUser): Promise<number> => {
  const hashedPassword = await hashPassword(newUser.password);
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO users (lastname, firstname, adress, zipcode, city, email, hash_password, picture, isadmin, isarchived, id_gender, adress_complement, id_athletic, birthday, phone, pseudo, authentified_by_facebook) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.lastname,
        newUser.firstname,
        newUser.adress,
        newUser.zipcode,
        newUser.city,
        newUser.email,
        hashedPassword,
        newUser.picture,
        newUser.isadmin,
        newUser.isarchived,
        newUser.id_gender,
        newUser.adress_complement,
        newUser.id_athletic,
        newUser.birthday,
        newUser.phone,
        newUser.pseudo,
        newUser.authentified_by_facebook,
      ]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idUser: number,
  attibutesToUpdate: IUser
): Promise<boolean> => {
  let sql = 'UPDATE users SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.lastname) {
    sql += 'lastname = ? ';
    sqlValues.push(attibutesToUpdate.lastname);
    oneValue = true;
  }
  if (attibutesToUpdate.firstname) {
    sql += oneValue ? ', firstname = ? ' : ' firstname = ? ';
    sqlValues.push(attibutesToUpdate.firstname);
    oneValue = true;
  }
  if (attibutesToUpdate.adress) {
    sql += oneValue ? ', adress = ? ' : ' adress = ? ';
    sqlValues.push(attibutesToUpdate.adress);
    oneValue = true;
  }
  if (attibutesToUpdate.zipcode) {
    sql += oneValue ? ', zipcode = ? ' : ' zipcode = ? ';
    sqlValues.push(attibutesToUpdate.zipcode);
    oneValue = true;
  }
  if (attibutesToUpdate.city) {
    sql += oneValue ? ', city = ? ' : ' city = ? ';
    sqlValues.push(attibutesToUpdate.city);
    oneValue = true;
  }
  if (attibutesToUpdate.email) {
    sql += oneValue ? ', email = ? ' : ' email = ? ';
    sqlValues.push(attibutesToUpdate.email);
    oneValue = true;
  }
  if (attibutesToUpdate.hash_password) {
    sql += oneValue ? ', hash_password = ? ' : ' hash_password = ? ';
    sqlValues.push(attibutesToUpdate.hash_password);
    oneValue = true;
  }
  if (attibutesToUpdate.picture) {
    sql += oneValue ? ', picture = ? ' : ' picture = ? ';
    sqlValues.push(attibutesToUpdate.picture);
    oneValue = true;
  }
  if (attibutesToUpdate.isadmin) {
    sql += oneValue ? ', isadmin = ? ' : ' isadmin = ? ';
    sqlValues.push(attibutesToUpdate.isadmin);
    oneValue = true;
  }
  if (attibutesToUpdate.isarchived) {
    sql += oneValue ? ', isarchived = ? ' : ' isarchived = ? ';
    sqlValues.push(attibutesToUpdate.isarchived);
    oneValue = true;
  }
  if (attibutesToUpdate.id_gender) {
    sql += oneValue ? ', id_gender = ? ' : ' id_gender = ? ';
    sqlValues.push(attibutesToUpdate.id_gender);
    oneValue = true;
  }
  if (attibutesToUpdate.adress_complement) {
    sql += oneValue ? ', adress_complement = ? ' : ' adress_complement = ? ';
    sqlValues.push(attibutesToUpdate.adress_complement);
    oneValue = true;
  }
  if (attibutesToUpdate.id_athletic) {
    sql += oneValue ? ', id_athletic = ? ' : ' id_athletic = ? ';
    sqlValues.push(attibutesToUpdate.id_athletic);
    oneValue = true;
  }
  if (attibutesToUpdate.birthday) {
    sql += oneValue ? ', birthday = ? ' : ' birthday = ? ';
    sqlValues.push(attibutesToUpdate.birthday);
    oneValue = true;
  }
  if (attibutesToUpdate.phone) {
    sql += oneValue ? ', phone = ? ' : ' phone = ? ';
    sqlValues.push(attibutesToUpdate.phone);
    oneValue = true;
  }
  if (attibutesToUpdate.pseudo) {
    sql += oneValue ? ', pseudo = ? ' : ' pseudo = ? ';
    sqlValues.push(attibutesToUpdate.pseudo);
    oneValue = true;
  }
  if (attibutesToUpdate.authentified_by_facebook) {
    sql += oneValue
      ? ', authentified_by_facebook = ? '
      : ' authentified_by_facebook = ? ';
    sqlValues.push(attibutesToUpdate.authentified_by_facebook);
    oneValue = true;
  }
  sql += ' WHERE id_user = ?';
  sqlValues.push(idUser);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idUser: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM users WHERE id_user = ?', [idUser])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAll,
  getById,
  recordExists,
  getByEmail,
  emailIsFree,
  getByPseudo,
  pseudoIsFree,
  create,
  update,
  destroy,
  validateUser,
  verifyPassword,
};
