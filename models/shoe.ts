import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IShoe from '../interfaces/IShoe';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateShoe = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(80).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const shoe = req.body as IShoe;
    const shoeWithSameName: IShoe = await getByName(shoe.name);
    if (shoeWithSameName) {
      next(new ErrorHandler(409, `Ce shoe existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_shoe',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IShoe[]> => {
  let sql = `SELECT * FROM shoes ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_shoe';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IShoe[]>(sql)
    .then(([results]) => results);
};

const getById = (idShoe: number): Promise<IShoe> => {
  return connection
    .promise()
    .query<IShoe[]>('SELECT * FROM shoes WHERE id_shoe = ?', [idShoe])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IShoe> => {
  return connection
    .promise()
    .query<IShoe[]>('SELECT * FROM shoes WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newShoe: IShoe): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO shoes (name) VALUES (?)', [
      newShoe.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (idShoe: number, attibutesToUpdate: IShoe): Promise<boolean> => {
  let sql = 'UPDATE shoes SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_shoe = ?';
  sqlValues.push(idShoe);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idShoe: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM shoes WHERE id_shoe = ?', [idShoe])
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
  validateShoe,
};
