import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISport from '../interfaces/ISport';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSport = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(80).presence(presence),
    icon: Joi.string().max(255).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const sport = req.body as ISport;
    const sportWithSameName: ISport = await getByName(sport.name);
    if (sportWithSameName) {
      next(new ErrorHandler(409, `Ce sport existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (): Promise<ISport[]> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports')
    .then(([results]) => results);
};

const getById = (idSport: number): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE id_sport = ?', [idSport])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newSport: ISport): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO sports (name) VALUES (?)', [
      newSport.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idSport: number,
  attibutesToUpdate: ISport
): Promise<boolean> => {
  let sql = 'UPDATE sports SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_sport = ?';
  sqlValues.push(idSport);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idSport: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sports WHERE id_sport = ?', [idSport])
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
  validateSport,
};
