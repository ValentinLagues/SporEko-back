import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IOffer_deliverer from '../interfaces/IOffer_deliverer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateOffer_deliverer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(80).presence(presence),
    icon: Joi.string().max(255).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const offer_deliverer = req.body as IOffer_deliverer;
    const offer_delivererWithSameName: IOffer_deliverer = await getByName(
      offer_deliverer.name
    );
    if (offer_delivererWithSameName) {
      next(new ErrorHandler(409, `Offer_deliverer name already exists`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_offer_deliverer',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IOffer_deliverer[]> => {
  let sql = `SELECT * FROM offer_deliverers ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_offer_deliverer';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IOffer_deliverer[]>(sql)
    .then(([results]) => results);
};

const getById = (idOffer_deliverer: number): Promise<IOffer_deliverer> => {
  return connection
    .promise()
    .query<IOffer_deliverer[]>(
      'SELECT * FROM offer_deliverers WHERE id_offer_deliverer = ?',
      [idOffer_deliverer]
    )
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IOffer_deliverer> => {
  return connection
    .promise()
    .query<IOffer_deliverer[]>(
      'SELECT * FROM offer_deliverers WHERE name = ?',
      [name]
    )
    .then(([results]) => results[0]);
};

const create = (newOffer_deliverer: IOffer_deliverer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO offer_deliverers (name) VALUES (?)', [
      newOffer_deliverer.name,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idOffer_deliverer: number,
  attibutesToUpdate: IOffer_deliverer
): Promise<boolean> => {
  let sql = 'UPDATE offer_deliverers SET ';
  const sqlValues: Array<string | number> = [];

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
  }
  sql += ' WHERE id_offer_deliverer = ?';
  sqlValues.push(idOffer_deliverer);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idOffer_deliverer: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM offer_deliverers WHERE id_offer_deliverer = ?',
      [idOffer_deliverer]
    )
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
  validateOffer_deliverer,
};
