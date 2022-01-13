import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IWeight from '../interfaces/IWeight';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateWeight = (req: Request, res: Response, next: NextFunction) => {
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
    const weight = req.body as IWeight;
    const weightWithSameName: IWeight = await getByName(weight.name);
    if (weightWithSameName) {
      next(new ErrorHandler(409, `Ce weight existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_weight',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IWeight[]> => {
  let sql = `SELECT * FROM weights ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_weight';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IWeight[]>(sql)
    .then(([results]) => results);
};

const getById = (idWeight: number): Promise<IWeight> => {
  return connection
    .promise()
    .query<IWeight[]>('SELECT * FROM weights WHERE id_weight = ?', [idWeight])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IWeight> => {
  return connection
    .promise()
    .query<IWeight[]>('SELECT * FROM weights WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newWeight: IWeight): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO weights (name) VALUES (?)', [
      newWeight.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idWeight: number,
  attibutesToUpdate: IWeight
): Promise<boolean> => {
  let sql = 'UPDATE weights SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_weight = ?';
  sqlValues.push(idWeight);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idWeight: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM weights WHERE id_weight = ?', [
      idWeight,
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
  validateWeight,
};
