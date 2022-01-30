import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IBrand from '../interfaces/IBrand';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateBrand = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_brand: Joi.number(),
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
    const brand = req.body as IBrand;
    const brandWithSameName: IBrand = await getByName(brand.name);
    if (brandWithSameName) {
      next(new ErrorHandler(409, `Brand name already exists`));
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
): Promise<IBrand[]> => {
  let sql = `SELECT *, id_brand as id FROM brands`;

  if (!sortBy) {
    sql += ` ORDER BY id_brand ASC`;
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
    .query<IBrand[]>(sql)
    .then(([results]) => results);
};

const getById = (idBrand: number): Promise<IBrand> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands WHERE id_brand = ?', [idBrand])
    .then(([results]) => results[0]);
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
    .query<ResultSetHeader>('INSERT INTO brands (name) VALUES (?)', [
      newBrand.name,
    ])
    .then(([results]) => results.insertId);
};

const update = async (
  idBrand: number,
  attibutesToUpdate: IBrand
): Promise<boolean> => {
  let sql = 'UPDATE brands SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
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
