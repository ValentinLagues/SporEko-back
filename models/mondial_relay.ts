import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IMondialRelay from '../interfaces/IMondialRelay';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateMondialRelay = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(150).presence(presence),
    price: Joi.number().positive().precision(2).strict().presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const mondialRelay = req.body as IMondialRelay;
    const mondialRelayWithSameName: IMondialRelay = await getByName(
      mondialRelay.name
    );
    if (mondialRelayWithSameName) {
      next(new ErrorHandler(409, `Ce nom de Mondial Relay existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_mondial_relay',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IMondialRelay[]> => {
  let sql = `SELECT * FROM mondial_relay ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_mondial_relay';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IMondialRelay[]>(sql)
    .then(([results]) => results);
};

const getById = (idMondialRelay: number): Promise<IMondialRelay> => {
  return connection
    .promise()
    .query<IMondialRelay[]>(
      'SELECT * FROM mondial_relay WHERE id_mondial_relay = ?',
      [idMondialRelay]
    )
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<IMondialRelay> => {
  return connection
    .promise()
    .query<IMondialRelay[]>('SELECT * FROM mondial_relay WHERE name = ?', [
      name,
    ])
    .then(([results]) => results[0]);
};

const create = (newMondialRelay: IMondialRelay): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO mondial_relay SET ?', [
      newMondialRelay,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idMondialRelay: number,
  newAttributes: IMondialRelay
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'UPDATE mondial_relay SET ? WHERE id_mondial_relay = ?',
      [newAttributes, idMondialRelay]
    )
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idMondialRelay: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM mondial_relay WHERE id_mondial_relay = ?',
      [idMondialRelay]
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
  validateMondialRelay,
};
