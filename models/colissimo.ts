import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IColissimo from '../interfaces/IColissimo';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateColissimo = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_colissimo: Joi.number(),
    name: Joi.string().max(150).presence(presence),
    price: Joi.number().positive().precision(2).strict().presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const recordExists = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const colissimo = req.body as IColissimo;
    colissimo.id_colissimo = parseInt(req.params.idColissimo);
    const recordFound: IColissimo = await getById(colissimo.id_colissimo);
    if (!recordFound) {
      next(new ErrorHandler(404, `Colissimo non trouvé`));
    } else {
      next();
    }
  })();
};

const nameIsFree = (req: Request, _res: Response, next: NextFunction) => {
  void (async () => {
    const colissimo = req.body as IColissimo;
    const colissimoWithSameName: IColissimo = await getByName(colissimo.name);
    if (colissimoWithSameName) {
      next(new ErrorHandler(409, `Ce nom de colissimo existe déjà`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string = 'id_colissimo',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IColissimo[]> => {
  let sql = `SELECT * FROM colissimo ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_colissimo';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IColissimo[]>(sql)
    .then(([results]) => results);
};

const getById = (idColissimo: number): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE id_colissimo = ?', [
      idColissimo,
    ])
    .then(([results]) => results[0]);
};

const getByName = async (name: string): Promise<IColissimo> => {
  return connection
    .promise()
    .query<IColissimo[]>('SELECT * FROM colissimo WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newColissimo: IColissimo): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO colissimo (name, price) VALUES (?, ?)',
      [newColissimo.name, newColissimo.price]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idColissimo: number,
  attibutesToUpdate: IColissimo
): Promise<boolean> => {
  let sql = 'UPDATE colissimo SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }

  if (attibutesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attibutesToUpdate.price);
    oneValue = true;
  }
  sql += ' WHERE id_colissimo = ?';
  sqlValues.push(idColissimo);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idColissimo: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM colissimo WHERE id_colissimo = ?', [
      idColissimo,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAll,
  getById,
  recordExists,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateColissimo,
};
