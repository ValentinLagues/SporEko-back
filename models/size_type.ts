import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISize_type from '../interfaces/ISize_type';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSize_type = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
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
    const size_type = req.body as ISize_type;
    const size_typeWithSameName: ISize_type = await getByName(size_type.name);
    if (size_typeWithSameName) {
      next(new ErrorHandler(409, `Size_type name already exists`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy = 'id_size_type',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<ISize_type[]> => {
  const sql = `SELECT * FROM size_types ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_size_type';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<ISize_type[]>(sql)
    .then(([results]) => results);
};

const getById = (idSize_type: number): Promise<ISize_type> => {
  return connection
    .promise()
    .query<ISize_type[]>('SELECT * FROM size_types WHERE id_size_type = ?', [
      idSize_type,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ISize_type> => {
  return connection
    .promise()
    .query<ISize_type[]>('SELECT * FROM size_types WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newSize_type: ISize_type): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO size_types (name) VALUES (?)', [
      newSize_type.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idSize_type: number,
  attibutesToUpdate: ISize_type
): Promise<boolean> => {
  let sql = 'UPDATE size_types SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_size_type = ?';
  sqlValues.push(idSize_type);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idSize_type: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM size_types WHERE id_size_type = ?', [
      idSize_type,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateSize_type,
};
