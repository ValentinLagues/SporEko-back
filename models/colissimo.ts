import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IColissimo from '../interfaces/IColissimo';

const validateColissimo = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(150).presence(presence),
    weight: Joi.string().max(100).presence(presence),
    price: Joi.number().positive().precision(2).strict().presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAll = async (): Promise<IColissimo[]> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo')
    .then(([results]) => results);
};

const recordExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const colissimo = req.body as IColissimo;
  const recordFound: IColissimo = await getById(colissimo.id_colissimo);
  if (!recordFound) {
    next(new ErrorHandler(404, `Colissimo non trouvé`));
  } else {
    next();
  }
};

const getById = async (idColissimo: number): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE id_colissimo = ?', [
      idColissimo,
    ])
    .then(([results]) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const colissimo = req.body as IColissimo;
  const colissimoWithSameName: IColissimo = await getByName(colissimo.name);
  if (colissimoWithSameName) {
    next(new ErrorHandler(409, `Ce nom de colissimo existe déjà`));
  } else {
    next();
  }
};

const getByName = async (name: string): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newColissimo: IColissimo): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO colissimo (name, weight, price) VALUES (?, ?, ?)',
      [newColissimo.name, newColissimo.weight, newColissimo.price]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idColissimo: number,
  attibutesToUpdate: IColissimo
): Promise<boolean> => {
  let sql = 'UPDATE colissimo SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  if (attibutesToUpdate.weight) {
    sql += oneValue ? ', weight = ? ' : ' weight = ? ';
    sqlValues.push(attibutesToUpdate.weight);
    oneValue = true;
  }
  if (attibutesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attibutesToUpdate.price);
    oneValue = true;
  }
  sql += ' WHERE id_colissimo = ?';
  sqlValues.push(idColissimo);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idColissimo: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM colissimo WHERE id_colissimo = ?', [
      idColissimo,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAll,
  getById,
  recordExists,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateColissimo,
};
