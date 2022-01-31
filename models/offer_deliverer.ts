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
    id_offer: Joi.number().integer().presence(presence),
    id_deliverer: Joi.number().integer().presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy = 'id_offer_deliverer',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IOffer_deliverer[]> => {
  const sql = `SELECT * FROM offer_deliverers ORDER BY ${sortBy} ${order}`;
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

const getDeliverersByIdOffer = async (idOffer: number): Promise<IOffer_deliverer> => {
  return connection
    .promise()
    .query<IOffer_deliverer[string | number]>(
      'SELECT id_deliverer FROM offer_deliverers WHERE id_offer = ?',
      [idOffer]
    )
    .then(([results]) => results);
};

const create = (newOffer_deliverer: IOffer_deliverer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO offer_deliverers (id_offer, id_deliverer) VALUES (?, ?)',
      [newOffer_deliverer.id_offer, newOffer_deliverer.id_deliverer]
    )
    .then(([results]) => results.insertId);
};

const update = (
  idOffer_deliverer: number,
  attibutesToUpdate: IOffer_deliverer
): Promise<boolean> => {
  let sql = 'UPDATE offer_deliverers SET ';
  const sqlValues: Array<string | number> = [];

  let oneValue = false;
  if (attibutesToUpdate.id_offer) {
    sql += 'id_offer = ? ';
    sqlValues.push(attibutesToUpdate.id_offer);
    oneValue = true;
  }
  if (attibutesToUpdate.id_deliverer) {
    sql += oneValue ? ', id_deliverer = ? ' : ' id_deliverer = ? ';
    sqlValues.push(attibutesToUpdate.id_deliverer);
    oneValue = true;
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

export { getAll, getById, getDeliverersByIdOffer, create, update, destroy, validateOffer_deliverer };
