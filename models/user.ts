import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi, { number } from 'joi';
import argon2, { Options } from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IUser from '../interfaces/IUser';
import multer from 'multer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
    req.file;
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_user: Joi.number(),
    lastname: Joi.string().max(255).presence(presence),
    firstname: Joi.string().max(255).presence(presence),
    address: Joi.string().max(255),
    zipcode: Joi.number().integer().max(99999),
    city: Joi.string().max(255),
    email: Joi.string().max(255).presence(presence),
    password: Joi.string().min(8).max(100).presence(presence),
    hash_password: Joi.string().max(255),
    picture: Joi.string().max(255),
    id_country: Joi.number().integer().min(1).presence(presence),
    is_admin: Joi.number().integer().min(0).max(1),
    is_archived: Joi.number().integer().min(0).max(1),
    is_professional: Joi.number().integer().min(0).max(1).presence(presence),
    id_gender: Joi.number().integer().min(1).presence(presence),
    address_complement: Joi.string().max(255),
    id_athletic: Joi.number().integer().min(1),
    birthday: Joi.string().max(50),
    phone: Joi.string().max(14),
    creation_date: Joi.string(),
    pseudo: Joi.string().max(25).presence(presence),
    authentified_by_facebook: Joi.number().integer().min(0).max(1),
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
      next(new ErrorHandler(404, `User not found`));
    } else {
      next();
    }
  })();
};
const emailIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const user = req.body as IUser;
    const userWithSameEmail: IUser = await getByEmail(user.email);
    if (
      userWithSameEmail &&
      userWithSameEmail.id_user !== (req.body.id_user as number)
    ) {
      next(new ErrorHandler(409, `Email already exists`));
    } else {
      next();
    }
  })();
};
const pseudoIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const user = req.body as IUser;
    const userWithSamePseudo: IUser = await getByPseudo(user.pseudo);
    if (
      userWithSamePseudo &&
      userWithSamePseudo.id_user !== (req.body.id_user as number)
    ) {
      next(new ErrorHandler(409, `Pseudo already exists`));
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

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './imageUser');
  },
  filename: function (_req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const fileFilter = (_req: Request, file: any, cb: CallableFunction) => {
  //reject file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('error'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 167 },
  fileFilter: fileFilter,
});

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<IUser[]> => {
  let sql = `SELECT *, id_user as id FROM users`;

  if (!sortBy) {
    sql += ` ORDER BY id_user ASC`;
  }
  if (sortBy) {
    sql += ` ORDER BY ${sortBy} ${order}`;
  }
  if (limit) {
    sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  }
  sql = sql.replace(/"/g, '');
  return connection
    .promise()
    .query<IUser[]>(sql)
    .then(([results]) => results);
};

const getById = (idUser: number): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE id_user = ?', [idUser])
    .then(([results]) => results[0]);
};

const getByEmail = (email: string): Promise<IUser> => {
  return connection
    .promise()
    .query<IUser[]>('SELECT * FROM users WHERE email = ?', [email])
    .then(([results]) => results[0]);
};

const getByPseudo = (pseudo: string): Promise<IUser> => {
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
      'INSERT INTO users (lastname, firstname, address, zipcode, city, email, is_professional, hash_password, picture, is_admin, is_archived, id_gender,id_country, address_complement, id_athletic, birthday, phone, pseudo, authentified_by_facebook) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.lastname,
        newUser.firstname,
        newUser.address,
        newUser.zipcode,
        newUser.city,
        newUser.email,
        newUser.is_professional,
        hashedPassword,
        newUser.picture,
        newUser.is_admin,
        newUser.is_archived,
        newUser.id_gender,
        newUser.id_country,
        newUser.address_complement,
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
    sql += ' lastname = ? ';
    sqlValues.push(attibutesToUpdate.lastname);
    oneValue = true;
  }
  if (attibutesToUpdate.firstname) {
    sql += oneValue ? ', firstname = ? ' : ' firstname = ? ';
    sqlValues.push(attibutesToUpdate.firstname);
    oneValue = true;
  }
  if (attibutesToUpdate.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(attibutesToUpdate.address);
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
  if (attibutesToUpdate.password) {
    const hash_password = await hashPassword(attibutesToUpdate.password);
    sql += oneValue ? ', hash_password = ? ' : ' hash_password = ? ';
    sqlValues.push(hash_password);
    oneValue = true;
  }
  if (attibutesToUpdate.hash_password) {
    const hash_password = await hashPassword(attibutesToUpdate.hash_password);
    sql += oneValue ? ', hash_password = ? ' : ' hash_password = ? ';
    sqlValues.push(hash_password);
    oneValue = true;
  }
  if (attibutesToUpdate.picture) {
    sql += oneValue ? ', picture = ? ' : ' picture = ? ';
    sqlValues.push(attibutesToUpdate.picture);
    oneValue = true;
  }
  if (attibutesToUpdate.is_admin) {
    sql += oneValue ? ', is_admin = ? ' : ' is_admin = ? ';
    sqlValues.push(attibutesToUpdate.is_admin);
    oneValue = true;
  }
  if (attibutesToUpdate.is_archived) {
    sql += oneValue ? ', is_archived = ? ' : ' is_archived = ? ';
    sqlValues.push(attibutesToUpdate.is_archived);
    oneValue = true;
  }
  if (attibutesToUpdate.is_professional) {
    sql += oneValue ? ', is_professional = ? ' : ' is_professional = ? ';
    sqlValues.push(attibutesToUpdate.is_professional);
    oneValue = true;
  }
  if (attibutesToUpdate.id_gender) {
    sql += oneValue ? ', id_gender = ? ' : ' id_gender = ? ';
    sqlValues.push(attibutesToUpdate.id_gender);
    oneValue = true;
  }
  if (attibutesToUpdate.id_country) {
    sql += oneValue ? ', id_country = ? ' : ' id_country = ? ';
    sqlValues.push(attibutesToUpdate.id_country);
    oneValue = true;
  }
  if (attibutesToUpdate.address_complement) {
    sql += oneValue ? ', address_complement = ? ' : ' address_complement = ? ';
    sqlValues.push(attibutesToUpdate.address_complement);
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
  sql += ' WHERE id_user = ? ';
  sqlValues.push(idUser);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const updateImage = (idUser: number, picture: string): Promise<boolean> => {
  const sql = 'UPDATE users SET picture = ? WHERE id_user = ? ';

  return connection
    .promise()
    .query<ResultSetHeader>(sql, [picture, idUser])
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idUser: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM users WHERE id_user = ?', [idUser])
    .then(([results]) => results.affectedRows === 1);
};

export default {
  upload,
  getAll,
  getById,
  recordExists,
  getByEmail,
  emailIsFree,
  getByPseudo,
  pseudoIsFree,
  create,
  update,
  updateImage,
  destroy,
  validateUser,
  verifyPassword,
};
