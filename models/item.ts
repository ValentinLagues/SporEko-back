import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IItem from '../interfaces/IItem';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateItem = (req: Request, res: Response, next: NextFunction) => {
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
    const item = req.body as IItem;
    const itemWithSameName: IItem = await getItemByName(item.name);
    if (itemWithSameName) {
      next(new ErrorHandler(409, `Item name already exists`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllItem = (
  sortBy = 'id_item',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IItem[]> => {
  const sql = `SELECT * FROM items ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_item';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IItem[]>(sql)
    .then(([results]) => results);
};

const getItemById = (id: number): Promise<IItem> => {
  return connection
    .promise()
    .query<IItem[]>('SELECT * FROM items WHERE id_item = ? ', [id])
    .then(([result]) => result[0]);
};

const getItemByName = (name: string) => {
  return connection
    .promise()
    .query<IItem[]>('SELECT * FROM items WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const getItemsByCategory = (id_category: number) => {
  return connection
    .promise()
    .query<IItem[]>('SELECT * FROM items WHERE id_category = ?', [id_category])
    .then(([results]) => results);
};

const createItem = (newItem: IItem): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO items (name, id_category) VALUES (?, ?)',
      [newItem.name, newItem.id_category]
    )
    .then(([results]) => results.insertId);
};

const updateItem = (
  id: number,
  name: string,
  id_category: number
): Promise<boolean> => {
  let sql = 'UPDATE items SET ';
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
  sql += ' WHERE id_item = ?';
  sqlValues.push(id);
  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const deleteItem = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM items WHERE id_item = ?', [id])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getItemByName,
  getAllItem,
  nameIsFree,
  getItemById,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
  validateItem,
};
