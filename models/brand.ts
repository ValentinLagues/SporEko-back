import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IBrand from '../interfaces/IBrand';

const validateBrand = (req: Request, res: Response, next: NextFunction) => {
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

const getAll = async (): Promise<IBrand[]> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands')
    .then(([results]) => results);
};

const getById = async (idBrand: number): Promise<IBrand> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands WHERE id_brand = ?', [idBrand])
    .then(([results]) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const brand = req.body as IBrand;
  const brandWithSameName: IBrand = await getByName(brand.name);
  if (brandWithSameName) {
    next(new ErrorHandler(409, `Ce nom de marque existe déjà`));
  } else {
    next();
  }
};

const getByName = async (name: string): Promise<IBrand> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newBrand: IBrand): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO brands (name) VALUES (?)',
      [newBrand.name]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idBrand: number,
  attibutesToUpdate: IBrand
): Promise<boolean> => {
  let sql = 'UPDATE brands SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  sql += ' WHERE id_brand = ?';
  sqlValues.push(idBrand);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idBrand: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM brands WHERE id_brand = ?', [idBrand])
    .then(([results]) => results.affectedRows === 1);
};

export {
  validateBrand,
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
};
