import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ICountries from '../interfaces/ICountries';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validatecountries = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
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
    const Country = req.body as ICountries;
    const CountryWithSameName: ICountries = await getByName(Country.name);
    if (CountryWithSameName) {
      next(new ErrorHandler(409, `Country name already exists`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy = 'id_country',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<ICountries[]> => {
  const sql = `SELECT * FROM countries ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_country';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<ICountries[]>(sql)
    .then(([results]) => results);
};

const getById = (idCountry: number): Promise<ICountries> => {
  return connection
    .promise()
    .query<ICountries[]>('SELECT * FROM countries WHERE id_country = ?', [
      idCountry,
    ])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ICountries> => {
  return connection
    .promise()
    .query<ICountries[]>('SELECT * FROM countries WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newCountry: ICountries): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO countries SET ?', [newCountry])
    .then(([results]) => results.insertId);
};

const update = (
  idCountry: number,
  newAttributes: ICountries
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE countries SET ? WHERE id_country = ?', [
      newAttributes,
      idCountry,
    ])
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

export {
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validatecountries,
};
