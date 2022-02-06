import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISizeType from '../interfaces/ISizeType';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSizeType = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_sizeType: Joi.number(),
    name: Joi.string().max(80).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const sizeType = req.body as ISizeType;
    const sizeTypeWithSameName: ISizeType = await getByName(sizeType.name);
    if (sizeTypeWithSameName) {
      next(new ErrorHandler(409, `SizeType name already exists`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<ISizeType[]> => {
  let sql = `SELECT *, id_size_type as id FROM size_types`;

  if (!sortBy) {
    sql += ` ORDER BY id_size_type ASC`;
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
    .query<ISizeType[]>(sql)
    .then(([results]) => results);
};

const getById = (idSizeType: number): Promise<ISizeType> => {
  return connection
    .promise()
    .query<ISizeType[]>('SELECT * FROM size_types WHERE id_size_type = ?', [
      idSizeType,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ISizeType> => {
  return connection
    .promise()
    .query<ISizeType[]>('SELECT * FROM size_types WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newSizeType: ISizeType): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO size_types (name) VALUES (?)', [
      newSizeType.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idSizeType: number,
  attibutesToUpdate: ISizeType
): Promise<boolean> => {
  let sql = 'UPDATE size_types SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_size_type = ?';
  sqlValues.push(idSizeType);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idSizeType: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM size_types WHERE id_size_type = ?', [
      idSizeType,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export default {
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateSizeType,
};
