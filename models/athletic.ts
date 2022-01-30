import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IAthletics from '../interfaces/IAthletics';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateAthletics = (req: Request, res: Response, next: NextFunction) => {
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
    const Athletic = req.body as IAthletics;
    const AthleticWithSameName: IAthletics = await getByName(Athletic.name);
    if (AthleticWithSameName) {
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
): Promise<IAthletics[]> => {
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
    .query<IAthletics[]>(sql)
    .then(([results]) => results);
};

const getById = (idAthletic: number): Promise<IAthletics> => {
  return connection
    .promise()
    .query<IAthletics[]>('SELECT * FROM athletics WHERE id_athletic = ?', [
      idAthletic,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IAthletics> => {
  return connection
    .promise()
    .query<IAthletics[]>('SELECT * FROM athletics WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newAthletic: IAthletics): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO athletics SET ?', [newAthletic])
    .then(([results]) => results.insertId);
};

const update = (
  idAthletic: number,
  attibutesToUpdate: IAthletics
): Promise<boolean> => {
  let sql = 'UPDATE athletics SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
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

export {
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateAthletics,
};
