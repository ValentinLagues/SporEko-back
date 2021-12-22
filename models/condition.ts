import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ICondition from '../interfaces/ICondition';

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

const getAll = async (): Promise<ICondition[]> => {
  return connection
    .promise()
    .query<ICondition[]>('SELECT * FROM conditions')
    .then(([results]) => results);
};

const getById = async (idCondition: number): Promise<ICondition> => {
  return connection
    .promise()
    .query<ICondition[]>('SELECT * FROM conditions WHERE id_condition = ?', [idCondition])
    .then(([results]) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const condition = req.body as ICondition;
  const conditionWithSameName: ICondition = await getByName(condition.name);
  if (conditionWithSameName) {
    next(new ErrorHandler(409, `Cet état existe déjà`));
  } else {
    next();
  }
};

const getByName = async (name: string): Promise<ICondition> => {
  return connection
    .promise()
    .query<ICondition[]>('SELECT * FROM conditions WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newCondition: ICondition): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO conditions (name) VALUES (?)',
      [newCondition.name]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idCondition: number,
  attibutesToUpdate: ICondition
): Promise<boolean> => {
  let sql = 'UPDATE conditions SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  sql += ' WHERE id_condition = ?';
  sqlValues.push(idCondition);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idCondition: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM conditions WHERE id_condition = ?', [idCondition])
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
