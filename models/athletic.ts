import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IAthletic from '../interfaces/IAthletic';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateAthletic = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_athletic: Joi.number(),
    name: Joi.string().max(200).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const athletic = req.body as IAthletic;
    const AthleticWithSameName: IAthletic = await getByName(athletic.name);
    if (
      AthleticWithSameName &&
      AthleticWithSameName.id_athletic !== athletic.id_athletic
    ) {
      next(new ErrorHandler(409, `Athletic name already exists`));
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
): Promise<IAthletic[]> => {
  let sql = `SELECT *, id_athletic as id FROM athletics`;

  if (!sortBy) {
    sql += ` ORDER BY id_athletic ASC`;
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
    .query<IAthletic[]>(sql)
    .then(([results]) => results);
};

const getById = (idAthletic: number): Promise<IAthletic> => {
  return connection
    .promise()
    .query<IAthletic[]>('SELECT * FROM athletics WHERE id_athletic = ?', [
      idAthletic,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IAthletic> => {
  return connection
    .promise()
    .query<IAthletic[]>('SELECT * FROM athletics WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newAthletic: IAthletic): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO athletics SET ?', [newAthletic])
    .then(([results]) => results.insertId);
};

const update = (
  idAthletic: number,
  attributesToUpdate: IAthletic
): Promise<boolean> => {
  let sql = 'UPDATE athletics SET ';
  const sqlValues: Array<string | number> = [];

  if (attributesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attributesToUpdate.name);
  }
  sql += ' WHERE id_athletic = ?';
  sqlValues.push(idAthletic);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idAthletic: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM athletics WHERE id_athletic = ?', [
      idAthletic,
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
  validateAthletic,
};
