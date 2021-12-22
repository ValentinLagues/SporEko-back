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

const getAll = (): Promise<IColissimo[]> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo')
    .then(([results]) => results);
};

const getById = (idcolissimo: number): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE id_colissimo = ?', [
      idcolissimo,
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

const getByName = (name: string): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newColissimo: IColissimo): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO colissimo SET ?', [newColissimo])
    .then(([results]) => results.insertId);
};

const update = (
  idcolissimo: number,
  newAttributes: IColissimo
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE colissimo SET ? WHERE id_colissimo = ?', [
      newAttributes,
      idcolissimo,
    ])
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idcolissimo: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM colissimo WHERE id_colissimo = ?', [
      idcolissimo,
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
  validateColissimo,
};
