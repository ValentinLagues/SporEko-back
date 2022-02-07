import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IOfferDeliverer from '../interfaces/IOfferDeliverer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateOfferDeliverer = (
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
): Promise<IOfferDeliverer[]> => {
  const sql = `SELECT * FROM offer_deliverers ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_offer_deliverer';
  }
  return connection
    .promise()
    .query<IOfferDeliverer[]>(sql)
    .then(([results]) => results);
};

const getById = (idOfferDeliverer: number): Promise<IOfferDeliverer> => {
  return connection
    .promise()
    .query<IOfferDeliverer[]>(
      'SELECT * FROM offer_deliverers WHERE id_offer_deliverer = ?',
      [idOfferDeliverer]
    )
    .then(([results]) => results[0]);
};

const getDeliverersByIdOffer = async (
  idOffer: number
): Promise<IOfferDeliverer[]> => {
  return connection
    .promise()
    .query<IOfferDeliverer[string | number]>(
      'SELECT d.* FROM deliverers AS d INNER JOIN offer_deliverers AS od ON d.id_deliverer = od.id_deliverer WHERE od.id_offer = ?',
      [idOffer]
    )
    .then(([results]) => results);
};
const getDelivByIdOffer = async (
  idOffer: number
): Promise<IOfferDeliverer[]> => {
  return connection
    .promise()
    .query<IOfferDeliverer[]>(
      'SELECT * FROM offer_deliverers WHERE id_offer = ?',
      [idOffer]
    )
    .then(([results]) => results);
};

const create = (newOfferDeliverer: IOfferDeliverer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO offer_deliverers (id_offer, id_deliverer) VALUES (?, ?)',
      [newOfferDeliverer.id_offer, newOfferDeliverer.id_deliverer]
    )
    .then(([results]) => results.insertId);
};

const update = (
  idOfferDeliverer: number,
  attributesToUpdate: IOfferDeliverer
): Promise<boolean> => {
  let sql = 'UPDATE offer_deliverers SET ';
  const sqlValues: Array<string | number> = [];

  let oneValue = false;
  if (attributesToUpdate.id_offer) {
    sql += 'id_offer = ? ';
    sqlValues.push(attributesToUpdate.id_offer);
    oneValue = true;
  }
  if (attributesToUpdate.id_deliverer) {
    sql += oneValue ? ', id_deliverer = ? ' : ' id_deliverer = ? ';
    sqlValues.push(attributesToUpdate.id_deliverer);
    oneValue = true;
  }
  sql += ' WHERE id_offer_deliverer = ?';
  sqlValues.push(idOfferDeliverer);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idOfferDeliverer: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM offer_deliverers WHERE id_offer_deliverer = ?',
      [idOfferDeliverer]
    )
    .then(([results]) => results.affectedRows === 1);
};

const destroyByIdOffer = (idOffer: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM offer_deliverers WHERE id_offer = ?', [
      idOffer,
    ])
    .then(([results]) => results.affectedRows === 1);
};
export default {
  getAll,
  getById,
  getDeliverersByIdOffer,
  getDelivByIdOffer,
  create,
  update,
  destroy,
  validateOfferDeliverer,
  destroyByIdOffer,
};
