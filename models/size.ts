import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import Joi from 'joi';

const validateSize = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(45).presence(required),
    is_children: Joi.number().integer().min(0).max(1).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllSizes = () => {
  const sql = 'SELECT * FROM sizes';
  return connection.promise().query(sql);
};

const getSizeById = (id: number) => {
  return connection
    .promise()
    .query<ISize[]>('SELECT * FROM sizes WHERE id_size = ? ', [id])
    .then(([result]) => result[0]);
};

<<<<<<< HEAD
const findManySizes = () => {
  const sql = 'SELECT * FROM sizes';
  return dbSizes.connection.promise().query(sql)
=======
const getSizeByName = (name: string) => {
  return connection
    .promise()
<<<<<<< HEAD
    .query('SELECT * FROM sizes WHERE name = ? ', [name])
    .then(([results]: Array<Array<ISize>>) => results[0]);
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
=======
    .query<ISize[]>('SELECT * FROM sizes WHERE name = ? ', [name])
    .then(([results]) => results[0]);
>>>>>>> 657142ce54dbba5b36dd8bdf79d46794e2099d67
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const gender = req.body as ISize;
  const genderWithSameName: ISize = await getSizeByName(gender.name);
  if (genderWithSameName) {
    next(new ErrorHandler(409, `Ce nom de genre existe déjà`));
  } else {
    next();
  }
};

const createSize = (newSize: ISize): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO sizes (name,is_children) VALUES (?,?) ',
      [newSize.name, newSize.is_children]
    )
    .then(([results]) => results.insertId);
};

const updateSize = (idSize: number, name: string, is_children: number) => {
  let sql = 'UPDATE sizes SET ';
  const sqlValues: Array<any> = [];
  let oneValue = false;
  if (name) {
    sql += 'name = ? ';
    sqlValues.push(name);
    oneValue = true;
  }
  if (is_children === 0 || is_children === 1) {
    sql += oneValue ? ', is_children = ? ' : ' is_children = ? ';
    sqlValues.push(is_children);
    oneValue = true;
  }
  sql += ' WHERE id_size = ?';
  sqlValues.push(idSize);
  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroySize = (id: number) => {
  return connection
    .promise()
    .query('DELETE FROM sizes WHERE id_size = ? ', [id]);
};

export {
  getAllSizes,
  nameIsFree,
  getSizeById,
  createSize,
  updateSize,
  destroySize,
  validateSize,
  getSizeByName,
};
