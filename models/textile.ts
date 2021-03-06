import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ITextile from '../interfaces/ITextile';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateTextile = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_textile: Joi.number(),
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
    const textile = req.body as ITextile;
    const textileWithSameName: ITextile = await getByName(textile.name);
    if (textileWithSameName) {
      next(new ErrorHandler(409, `Textile name already exists`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = async (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<ITextile[]> => {
  let sql = `SELECT *, id_textile as id FROM textiles`;

  if (!sortBy) {
    sql += ` ORDER BY id_textile ASC`;
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
    .query<ITextile[]>(sql)
    .then(([results]) => results);
};

const getById = async (idTextile: number): Promise<ITextile> => {
  return connection
    .promise()
    .query<ITextile[]>('SELECT * FROM textiles WHERE id_textile = ?', [
      idTextile,
    ])
    .then(([results]) => results[0]);
};

const getByName = async (name: string): Promise<ITextile> => {
  return connection
    .promise()
    .query<ITextile[]>('SELECT * FROM textiles WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newTextile: ITextile): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO textiles (name) VALUES (?)', [
      newTextile.name,
    ])
    .then(([results]) => results.insertId);
};

const update = async (
  idTextile: number,
  attributesToUpdate: ITextile
): Promise<boolean> => {
  let sql = 'UPDATE textiles SET ';
  const sqlValues: Array<string | number> = [];

  if (attributesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attributesToUpdate.name);
  }
  sql += ' WHERE id_textile = ?';
  sqlValues.push(idTextile);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idTextile: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM textiles WHERE id_textile = ?', [
      idTextile,
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
  validateTextile,
};
