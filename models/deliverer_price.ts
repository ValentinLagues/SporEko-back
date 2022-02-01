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
    const deliverer_price = req.body as IDeliverer_price;
    const deliverer_priceWithSameName: IDeliverer_price =
      await getDeliverer_priceByName(deliverer_price.name);
    if (
      deliverer_priceWithSameName &&
      deliverer_priceWithSameName.id_deliverer_price !==
        req.body.id_deliverer_price
    ) {
      next(new ErrorHandler(409, `Deliverer_price name already exists`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllDeliverer_price = (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<IDeliverer_price[]> => {
  let sql = `SELECT *, id_deliverer_price as id FROM deliverer_prices`;

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

// const getDeliverer_priceByPrice = (name: string) => {
//   return connection
//     .promise()
//     .query<IDeliverer_price[]>(
//       'SELECT price FROM deliverer_prices AS dp INNER JOIN offers AS o WHERE dp.id_deliverer = ? AND o.weight BETWEEN dp.min_weight AND dp.max_weight',
//       [name]
//     )
//     .then(([results]) => results[0]);
// };

const createDeliverer_price = (
  newDeliverer_price: IDeliverer_price
): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO deliverer_prices (name, min_weight, max_weight, price, id_deliverer,) VALUES (?, ?, ?, ?, ?)',
      [
        newDeliverer_price.name,
        newDeliverer_price.min_weight,
        newDeliverer_price.max_weight,
        newDeliverer_price.price,
        newDeliverer_price.id_deliverer,
      ]
    )
    .then(([results]) => results.insertId);
};

const updateDeliverer_price = (
  id: number,
  attibutesToUpdate: IDeliverer_price
): Promise<boolean> => {
  let sql = 'UPDATE deliverer_prices SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  if (attibutesToUpdate.min_weight) {
    sql += oneValue ? ', min_weight = ? ' : ' min_weight = ? ';
    sqlValues.push(attibutesToUpdate.min_weight);
    oneValue = true;
  }
  if (attibutesToUpdate.max_weight) {
    sql += oneValue ? ', max_weight = ? ' : ' max_weight = ? ';
    sqlValues.push(attibutesToUpdate.max_weight);
    oneValue = true;
  }
  if (attibutesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attibutesToUpdate.price);
    oneValue = true;
  }
  if (attibutesToUpdate.id_deliverer) {
    sql += oneValue ? ', id_deliverer = ? ' : ' id_deliverer = ? ';
    sqlValues.push(attibutesToUpdate.id_deliverer);
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
  // getDeliverer_priceByPrice,
  createDeliverer_price,
  updateDeliverer_price,
  deleteDeliverer_price,
  validateDeliverer_price,
};
