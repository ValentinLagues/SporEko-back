import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ICondition from '../interfaces/ICondition';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateCondition = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(50).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const condition = req.body as ICondition;
    const conditionWithSameName: ICondition = await getByName(condition.name);
    if (conditionWithSameName) {
      next(new ErrorHandler(409, `Cet état existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_condition',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<ICondition[]> => {
  let sql = `SELECT * FROM conditions ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_condition';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<ICondition[]>(sql)
    .then(([results]) => results);
};

const getById = (idCondition: number): Promise<ICondition> => {
  return connection
    .promise()
    .query<ICondition[]>('SELECT * FROM conditions WHERE id_condition = ?', [
      idCondition,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ICondition> => {
  return connection
    .promise()
    .query<ICondition[]>('SELECT * FROM conditions WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newCondition: ICondition): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO conditions (name) VALUES (?)', [
      newCondition.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idCondition: number,
  attibutesToUpdate: ICondition
): Promise<boolean> => {
  let sql = 'UPDATE conditions SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_condition = ?';
  sqlValues.push(idCondition);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idCondition: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM conditions WHERE id_condition = ?', [
      idCondition,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  validateCondition,
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
};
