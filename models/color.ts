import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IColor from '../interfaces/IColor';

const validateColor = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_color: Joi.number(),
    name: Joi.string().max(50).presence(presence),
    color_code: Joi.string().min(7).max(9).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAll = async (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<IColor[]> => {
  let sql = 'SELECT * FROM colors';
  if (sortBy) {
    if (sortBy === 'id') {
      sortBy = 'id_color';
    }
    sql += ` ORDER BY ${sortBy} ${order} LIMIT ${limit} OFFSET ${firstItem}`;
  }
  return connection
    .promise()
    .query<IColor[]>(sql)
    .then(([results]) => results);
};

const recordExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const color = req.body as IColor;
  color.id_color = parseInt(req.params.idColor);
  const recordFound: IColor = await getById(color.id_color);
  if (!recordFound) {
    next(new ErrorHandler(404, `Couleur non trouvée`));
  } else {
    next();
  }
};

const getById = async (idColor: number): Promise<IColor> => {
  return connection
    .promise()
    .query<IColor[]>('SELECT * FROM colors WHERE id_color = ?', [idColor])
    .then(([results]) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const color = req.body as IColor;
  const colorWithSameName: IColor = await getByName(color.id, color.name);
  if (colorWithSameName) {
    next(new ErrorHandler(409, `Ce nom de couleur existe déjà`));
  } else {
    next();
  }
};

const getByName = async (id: number, name: string): Promise<IColor> => {
  return connection
    .promise()
    .query<IColor[]>('SELECT * FROM colors WHERE id_color != ? AND name = ?', [
      id,
      name,
    ])
    .then(([results]) => results[0]);
};

const codeIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const color = req.body as IColor;
  const colorWithSameCode: IColor = await getByCode(color.id, color.color_code);
  if (colorWithSameCode) {
    next(new ErrorHandler(409, `Ce code couleur existe déjà`));
  } else {
    next();
  }
};

const getByCode = async (id: number, color_code: string): Promise<IColor> => {
  return connection
    .promise()
    .query<IColor[]>(
      'SELECT * FROM colors WHERE id_color != ? AND color_code = ?',
      [id, color_code]
    )
    .then(([results]) => results[0]);
};

const create = async (newColor: IColor): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO colors (name, color_code) VALUES (?, ?)',
      [newColor.name, newColor.color_code]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idColor: number,
  attibutesToUpdate: IColor
): Promise<boolean> => {
  let sql = 'UPDATE colors SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  if (attibutesToUpdate.color_code) {
    sql += oneValue ? ', color_code = ? ' : ' color_code = ? ';
    sqlValues.push(attibutesToUpdate.color_code);
  }
  sql += ' WHERE id_color = ?';
  sqlValues.push(idColor);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idColor: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM colors WHERE id_color = ?', [idColor])
    .then(([results]) => results.affectedRows === 1);
};

const destroyMany = async (ids: Array<number>): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM colors WHERE id_color IN ( ? )', [
      ids.map((id) => id),
    ])
    .then(([results]) => results.affectedRows > 0);
};

export {
  getAll,
  getById,
  recordExists,
  getByName,
  nameIsFree,
  codeIsFree,
  create,
  update,
  destroy,
  destroyMany,
  validateColor,
};
