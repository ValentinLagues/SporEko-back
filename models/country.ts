import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ICountry from '../interfaces/ICountry';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validatecountries = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_country: Joi.number(),
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
    const Country = req.body as ICountry;
    const CountryWithSameName: ICountry = await getByName(Country.name);
    if (CountryWithSameName) {
      next(new ErrorHandler(409, `Country name already exists`));
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
): Promise<ICountry[]> => {
  let sql = `SELECT *, id_country as id FROM countries`;

  if (!sortBy) {
    sql += ` ORDER BY id_country ASC`;
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
    .query<ICountry[]>(sql)
    .then(([results]) => results);
};

const getById = (idCountry: number): Promise<ICountry> => {
  return connection
    .promise()
    .query<ICountry[]>('SELECT * FROM countries WHERE id_country = ?', [
      idCountry,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ICountry> => {
  return connection
    .promise()
    .query<ICountry[]>('SELECT * FROM countries WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newCountry: ICountry): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO countries SET ?', [newCountry])
    .then(([results]) => results.insertId );
};

const update = (
  idCountry: number,
  newAttributes: ICountry
): Promise<boolean> => {
  let sql = 'UPDATE countries SET ';
  const sqlValues: Array<string | number> = [];

  if (newAttributes.name) {
    sql += 'name = ? ';
    sqlValues.push(newAttributes.name);
  }
  sql += ' WHERE id_country = ?';
  sqlValues.push(idCountry);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idCountry: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM countries WHERE id_country = ?', [
      idCountry,
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
  validatecountries,
};
