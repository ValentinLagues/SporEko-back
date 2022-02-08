import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IDeliverer from '../interfaces/IDeliverer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateDeliverer = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_deliverer: Joi.number(),
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
    const deliverer = req.body as IDeliverer;
    const delivererWithSameName: IDeliverer = await getByName(deliverer.name);
    if (delivererWithSameName) {
      next(new ErrorHandler(409, `Deliverer name already exists`));
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
): Promise<IDeliverer[]> => {
  let sql = `SELECT *, id_deliverer as id FROM deliverers`;

  if (!sortBy) {
    sql += ` ORDER BY id_deliverer ASC`;
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
    .query<IDeliverer[]>(sql)
    .then(([results]) => results);
};

const getById = (idDeliverer: number): Promise<IDeliverer> => {
  return connection
    .promise()
    .query<IDeliverer[]>('SELECT * FROM deliverers WHERE id_deliverer = ?', [
      idDeliverer,
    ])
    .then(([results]) => results[0]);
};

const getDeliverersByIdOffer = async (
  idOffer: number
): Promise<IDeliverer[]> => {
  return connection
    .promise()
    .query<IDeliverer[]>(
      'SELECT d.* FROM deliverers AS d INNER JOIN offer_deliverers AS od ON d.id_deliverer = od.id_deliverer WHERE od.id_offer = ?',
      [idOffer]
    )
    .then(([results]) => results);
};

const getByName = (name: string): Promise<IDeliverer> => {
  return connection
    .promise()
    .query<IDeliverer[]>('SELECT * FROM deliverers WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newDeliverer: IDeliverer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO deliverers (name) VALUES (?)', [
      newDeliverer.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idDeliverer: number,
  attributesToUpdate: IDeliverer
): Promise<boolean> => {
  let sql = 'UPDATE deliverers SET ';
  const sqlValues: Array<string | number> = [];

  if (attributesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attributesToUpdate.name);
  }
  sql += ' WHERE id_deliverer = ?';
  sqlValues.push(idDeliverer);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idDeliverer: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM deliverers WHERE id_deliverer = ?', [
      idDeliverer,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export default {
  validateDeliverer,
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  getDeliverersByIdOffer
};
