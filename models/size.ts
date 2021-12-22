import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import Joi from 'joi';

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

const getAllSizes = () => {
  let sql = 'SELECT * FROM sizes';
  return connection.promise().query(sql);
};

const getSizeById = (id: number) => {
  return connection
    .promise()
    .query('SELECT * FROM sizes WHERE id_size = ? ', [id]);
};

const getSizeByName = (name: string) => {
  return connection
    .promise()
    .query('SELECT * FROM sizes WHERE name = ? ', [name])
    .then(([results]: Array<Array<ISize>>) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const size = req.body as ISize;
  const sizeWithSameName: ISize = await getSizeByName(size.name);
  if (sizeWithSameName) {
    next(new ErrorHandler(409, `Ce nom de taille existe déjà`));
  } else {
    next();
  }
};

const createSize = (newSize: ISize) => {
  return connection
    .promise()
    .query('INSERT INTO sizes (name,is_children) VALUES (?,?) ', [
      newSize.name,
      newSize.is_children,
    ])
    .then(([results]: Array<ResultSetHeader>) => results.insertId);
};

const updateSize = (idSize: number, name: string, is_children: number) => {
  let sql: string = 'UPDATE sizes SET ';
  let sqlValues: Array<any> = [];
  let oneValue: boolean = false;
  console.log(is_children);
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
    .query(sql, sqlValues)
    .then(([results]: Array<ResultSetHeader>) => results.affectedRows === 1);
};

const destroySize = (id: number) => {
  return connection
    .promise()
    .query('DELETE FROM sizes WHERE id_size = ? ', [id]);
};

export {
  getAllSizes,
  nameIsFree,
  getSizeById,
  createSize,
  updateSize,
  destroySize,
  validateSize,
  getSizeByName,
};
