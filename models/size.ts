import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import Joi from 'joi';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSize = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(45).presence(required),
    is_children: Joi.number().integer().min(0).max(1).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const nameIsFree = (req: Request, _res: Response, next: NextFunction) => {
  void (async () => {
    const gender = req.body as ISize;
    const genderWithSameName: ISize = await getSizeByName(gender.name);
    if (genderWithSameName) {
      next(new ErrorHandler(409, `Size name already exists`));
    } else {
      next();
    }
  })();
};

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAllSizes = (
  sortBy = 'id_size',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<ISize[]> => {
  const sql = `SELECT * FROM sizes ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_size';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<ISize[]>(sql)
    .then(([results]) => results);
};

const getSizeById = (id: number): Promise<ISize> => {
  return connection
    .promise()
    .query<ISize[]>('SELECT * FROM sizes WHERE id_size = ? ', [id])
    .then(([result]) => result[0]);
};

const getSizeByName = (name: string): Promise<ISize> => {
  return connection
    .promise()
    .query<ISize[]>('SELECT * FROM sizes WHERE name = ? ', [name])
    .then(([results]) => results[0]);
};

const createSize = (newSize: ISize): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO sizes (name,is_children) VALUES (?,?) ',
      [newSize.name, newSize.is_children]
    )
    .then(([results]) => results.insertId);
};

const updateSize = (
  idSize: number,
  name: string,
  is_children: number
): Promise<boolean> => {
  console.log('1');
  let sql = 'UPDATE sizes SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;
  if (name) {
    sql += 'name = ? ';
    sqlValues.push(name);
    oneValue = true;
  }
  if (is_children === 0 || is_children === 1) {
    sql += oneValue ? ', is_children = ? ' : ' is_children = ? ';
    sqlValues.push(is_children);
    oneValue = true;
  }
  sql += ' WHERE id_size = ?';
  sqlValues.push(idSize);
  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const deleteSize = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sizes WHERE id_size = ? ', [id])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAllSizes,
  nameIsFree,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
  validateSize,
  getSizeByName,
};
