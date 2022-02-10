import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IDelivererPrice from '../interfaces/IDelivererPrice';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateDelivererPrice = (
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
    id: Joi.number(),
    id_deliverer_price: Joi.number().integer(),
    name: Joi.string().max(150).presence(required),
    min_weight: Joi.number().integer().presence(required),
    max_weight: Joi.number().integer().presence(required),
    price: Joi.number().positive().precision(2).strict().presence(required),
    id_deliverer: Joi.number().integer().presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const delivererPrice = req.body as IDelivererPrice;
    const delivererPriceWithSameName: IDelivererPrice =
      await getDelivererPriceByName(delivererPrice.name);
    if (
      delivererPriceWithSameName &&
      delivererPriceWithSameName.id_deliverer_price !==
        delivererPrice.id_deliverer_price
    ) {
      next(new ErrorHandler(409, `DelivererPrice name already exists`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllDelivererPrice = (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string,
  idDeliverer: string,
  weight: string
): Promise<IDelivererPrice[]> => {
  let sql = `SELECT *, id_deliverer_price as id FROM deliverer_prices`;
  const sqlValues: string[] = [];
  if (idDeliverer && weight) {
    sql += ` WHERE id_deliverer = ? AND ? BETWEEN min_weight AND max_weight`;
    sqlValues.push(idDeliverer, weight);
  }
  if (!sortBy) {
    sql += ` ORDER BY id_deliverer_price ASC`;
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
    .query<IDelivererPrice[]>(sql, sqlValues)
    .then(([results]) => results);
};

const getDelivererPriceById = (id: number): Promise<IDelivererPrice> => {
  return connection
    .promise()
    .query<IDelivererPrice[]>(
      'SELECT * FROM deliverer_prices WHERE id_deliverer_price = ? ',
      [id]
    )
    .then(([result]) => result[0]);
};

const getDelivererPriceByName = (name: string) => {
  return connection
    .promise()
    .query<IDelivererPrice[]>('SELECT * FROM deliverer_prices WHERE name = ?', [
      name,
    ])
    .then(([results]) => results[0]);
}


const create = (newDelivererPrice: IDelivererPrice): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO deliverer_prices (name, min_weight, max_weight, price, id_deliverer) VALUES (?, ?, ?, ?, ?)',
      [
        newDelivererPrice.name,
        newDelivererPrice.min_weight,
        newDelivererPrice.max_weight,
        newDelivererPrice.price,
        newDelivererPrice.id_deliverer,
      ]
    )
    .then(([results]) => results.insertId);
};

const updateDelivererPrice = (
  id: number,
  attributesToUpdate: IDelivererPrice
): Promise<boolean> => {
  let sql = 'UPDATE deliverer_prices SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attributesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attributesToUpdate.name);
    oneValue = true;
  }
  if (attributesToUpdate.min_weight) {
    sql += oneValue ? ', min_weight = ? ' : ' min_weight = ? ';
    sqlValues.push(attributesToUpdate.min_weight);
    oneValue = true;
  }
  if (attributesToUpdate.max_weight) {
    sql += oneValue ? ', max_weight = ? ' : ' max_weight = ? ';
    sqlValues.push(attributesToUpdate.max_weight);
    oneValue = true;
  }
  if (attributesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attributesToUpdate.price);
    oneValue = true;
  }
  if (attributesToUpdate.id_deliverer) {
    sql += oneValue ? ', id_deliverer = ? ' : ' id_deliverer = ? ';
    sqlValues.push(attributesToUpdate.id_deliverer);
    oneValue = true;
  }
  sql += ' WHERE id_deliverer_price = ?';
  sqlValues.push(id);
  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const deleteDelivererPrice = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'DELETE FROM deliverer_prices WHERE id_deliverer_price = ?',
      [id]
    )
    .then(([results]) => results.affectedRows === 1);
};

export default {
  getDelivererPriceByName,
  getAllDelivererPrice,
  nameIsFree,
  getDelivererPriceById,
  create,
  updateDelivererPrice,
  deleteDelivererPrice,
  validateDelivererPrice,
};
