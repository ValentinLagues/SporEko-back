import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IDeliverer_price from '../interfaces/IDeliverer_price';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateDeliverer_price = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let required: Joi.PresenceMode = 'optional';
  req.params;
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(50).presence(required),
    id_category: Joi.number().integer().presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const deliverer_price = req.body as IDeliverer_price;
    const deliverer_priceWithSameName: IDeliverer_price =
      await getDeliverer_priceByName(deliverer_price.name);
    if (deliverer_priceWithSameName) {
      next(new ErrorHandler(409, `Deliverer_price name already exists`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllDeliverer_price = (
  sortBy: string = 'id_deliverer_price',
  order: string = 'ASC'
  // firstDeliverer_price: string,
  // limit: string
): Promise<IDeliverer_price[]> => {
  let sql = `SELECT * FROM deliverer_prices ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_deliverer_price';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstDeliverer_price}`;
  // }
  return connection
    .promise()
    .query<IDeliverer_price[]>(sql)
    .then(([results]) => results);
};

const getDeliverer_priceById = (id: number): Promise<IDeliverer_price> => {
  return connection
    .promise()
    .query<IDeliverer_price[]>(
      'SELECT * FROM deliverer_prices WHERE id_deliverer_price = ? ',
      [id]
    )
    .then(([result]) => result[0]);
};

const getDeliverer_priceByName = (name: string) => {
  return connection
    .promise()
    .query<IDeliverer_price[]>(
      'SELECT * FROM deliverer_prices WHERE name = ?',
      [name]
    )
    .then(([results]) => results[0]);
};

const createDeliverer_price = (
  newDeliverer_price: IDeliverer_price
): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO deliverer_prices (name, id_category) VALUES (?, ?)',
      [newDeliverer_price.name, newDeliverer_price.id_category]
    )
    .then(([results]) => results.insertId);
};

const updateDeliverer_price = (
  id: number,
  name: string,
  id_category: number
): Promise<boolean> => {
  let sql = 'UPDATE deliverer_prices SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (name) {
    sql += 'name = ? ';
    sqlValues.push(name);
    oneValue = true;
  }
  if (id_category) {
    sql += oneValue ? ', id_category = ? ' : ' id_category = ? ';
    sqlValues.push(id_category);
    oneValue = true;
  }
  sql += ' WHERE id_deliverer_price = ?';
  sqlValues.push(id);
  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const deleteDeliverer_price = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM deliverer_prices WHERE id_deliverer_price = ?',
      [id]
    )
    .then(([results]) => results.affectedRows === 1);
};

export {
  getDeliverer_priceByName,
  getAllDeliverer_price,
  nameIsFree,
  getDeliverer_priceById,
  createDeliverer_price,
  updateDeliverer_price,
  deleteDeliverer_price,
  validateDeliverer_price,
};
