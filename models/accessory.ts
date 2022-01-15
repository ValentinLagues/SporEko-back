import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IAccessory from '../interfaces/IAccessory';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateAccessory = (req: Request, res: Response, next: NextFunction) => {
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
    const accessory = req.body as IAccessory;
    const accessoryWithSameName: IAccessory = await getByName(accessory.name);
    if (accessoryWithSameName) {
      next(new ErrorHandler(409, `Cette categorie existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy = 'id_accessory',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IAccessory[]> => {
  const sql = `SELECT * FROM accessories ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_accessory';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IAccessory[]>(sql)
    .then(([results]) => results);
};

const getById = (idAccessory: number): Promise<IAccessory> => {
  return connection
    .promise()
    .query<IAccessory[]>('SELECT * FROM accessories WHERE id_accessory = ?', [
      idAccessory,
    ])
    .then(([results]) => results[0]);
};

const getByName = async (name: string): Promise<IAccessory> => {
  return connection
    .promise()
    .query<IAccessory[]>('SELECT * FROM accessories WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newAccessory: IAccessory): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO accessories (name) VALUES (?)', [
      newAccessory.name,
    ])
    .then(([results]) => results.insertId);
};

const update = async (
  idAccessory: number,
  attibutesToUpdate: IAccessory
): Promise<boolean> => {
  let sql = 'UPDATE accessories SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_accessory = ?';
  sqlValues.push(idAccessory);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idAccessory: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM accessories WHERE id_accessory = ?', [
      idAccessory,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  validateAccessory,
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
};
