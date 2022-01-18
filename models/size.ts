import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import Joi, { number } from 'joi';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSize = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    id_size: Joi.number().integer(),
    id_gender: Joi.number().integer().presence(required),
    is_child: Joi.number().integer().min(0).max(1),
    id_size_type: Joi.number().integer().presence(required),
    size_int: Joi.string().max(8),
    size_eu: Joi.string().max(8),
    size_fr: Joi.string().max(8),
    size_uk: Joi.string().max(8),
    size_us: Joi.string().max(8),
    size_foot: Joi.string().max(12),
    size_chest: Joi.string().max(12),
    size_pool: Joi.string().max(12),
    size_jeans: Joi.string().max(8),
    age_child: Joi.string().max(8),
    height: Joi.string().max(10),
    hand_turn: Joi.string().max(8),
    size_glove: Joi.string().max(8),
    crotch: Joi.string().max(8),
    size_bike_inches: Joi.string().max(12),
    size_bike: Joi.string().max(8),
    size_wheel: Joi.string().max(8),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
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

const createSize = (newSize: ISize): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO sizes ( id_gender, is_child, id_size_type, size_int, size_eu, size_fr, size_uk, size_us, size_foot, size_chest, size_pool, size_jeans, age_child, height, hand_turn, size_glove, crotch, size_bike_inches, size_bike, size_wheel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
      [
        newSize.id_gender,
        newSize.is_child,
        newSize.id_size_type,
        newSize.size_int,
        newSize.size_eu,
        newSize.size_fr,
        newSize.size_uk,
        newSize.size_us,
        newSize.size_foot,
        newSize.size_chest,
        newSize.size_pool,
        newSize.size_jeans,
        newSize.age_child,
        newSize.height,
        newSize.hand_turn,
        newSize.size_glove,
        newSize.crotch,
        newSize.size_bike_inches,
        newSize.size_bike,
        newSize.size_wheel,
      ]
    )
    .then(([results]) => results.insertId);
};

const updateSize = (
  idSize: number,
  attibutesToUpdate: ISize
): Promise<boolean> => {
  let sql = 'UPDATE sizes SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;
  if (attibutesToUpdate.id_gender) {
    sql += 'id_gender = ? ';
    sqlValues.push(attibutesToUpdate.id_gender);
    oneValue = true;
  }
  if (attibutesToUpdate.is_child) {
    sql += oneValue ? ', is_child = ? ' : ' is_child = ? ';
    sqlValues.push(attibutesToUpdate.is_child);
    oneValue = true;
  }
  if (attibutesToUpdate.id_size_type) {
    sql += oneValue ? ', id_size_type = ? ' : ' id_size_type = ? ';
    sqlValues.push(attibutesToUpdate.id_size_type);
    oneValue = true;
  }
  if (attibutesToUpdate.size_int) {
    sql += oneValue ? ', size_int = ? ' : ' size_int = ? ';
    sqlValues.push(attibutesToUpdate.size_int);
    oneValue = true;
  }
  if (attibutesToUpdate.size_eu) {
    sql += oneValue ? ', size_eu = ? ' : ' size_eu = ? ';
    sqlValues.push(attibutesToUpdate.size_eu);
    oneValue = true;
  }
  if (attibutesToUpdate.size_fr) {
    sql += oneValue ? ', size_fr = ? ' : ' size_fr = ? ';
    sqlValues.push(attibutesToUpdate.size_fr);
    oneValue = true;
  }
  if (attibutesToUpdate.size_uk) {
    sql += oneValue ? ', size_uk = ? ' : ' size_uk = ? ';
    sqlValues.push(attibutesToUpdate.size_uk);
    oneValue = true;
  }
  if (attibutesToUpdate.size_us) {
    sql += oneValue ? ', size_us = ? ' : ' size_us = ? ';
    sqlValues.push(attibutesToUpdate.size_us);
    oneValue = true;
  }
  if (attibutesToUpdate.size_foot) {
    sql += oneValue ? ', size_foot = ? ' : ' size_foot = ? ';
    sqlValues.push(attibutesToUpdate.size_foot);
    oneValue = true;
  }
  if (attibutesToUpdate.size_chest) {
    sql += oneValue ? ', size_chest = ? ' : ' size_chest = ? ';
    sqlValues.push(attibutesToUpdate.size_chest);
    oneValue = true;
  }
  if (attibutesToUpdate.size_pool) {
    sql += oneValue ? ', size_pool = ? ' : ' size_pool = ? ';
    sqlValues.push(attibutesToUpdate.size_pool);
    oneValue = true;
  }
  if (attibutesToUpdate.size_jeans) {
    sql += oneValue ? ', size_jeans = ? ' : ' size_jeans = ? ';
    sqlValues.push(attibutesToUpdate.size_jeans);
    oneValue = true;
  }
  if (attibutesToUpdate.age_child) {
    sql += oneValue ? ', age_child = ? ' : ' age_child = ? ';
    sqlValues.push(attibutesToUpdate.age_child);
    oneValue = true;
  }
  if (attibutesToUpdate.height) {
    sql += oneValue ? ', height = ? ' : ' height = ? ';
    sqlValues.push(attibutesToUpdate.height);
    oneValue = true;
  }
  if (attibutesToUpdate.hand_turn) {
    sql += oneValue ? ', hand_turn = ? ' : ' hand_turn = ? ';
    sqlValues.push(attibutesToUpdate.hand_turn);
    oneValue = true;
  }
  if (attibutesToUpdate.size_glove) {
    sql += oneValue ? ', size_glove = ? ' : ' size_glove = ? ';
    sqlValues.push(attibutesToUpdate.size_glove);
    oneValue = true;
  }
  if (attibutesToUpdate.crotch) {
    sql += oneValue ? ', crotch = ? ' : ' crotch = ? ';
    sqlValues.push(attibutesToUpdate.crotch);
    oneValue = true;
  }
  if (attibutesToUpdate.size_bike_inches) {
    sql += oneValue ? ', size_bike_inches = ? ' : ' size_bike_inches = ? ';
    sqlValues.push(attibutesToUpdate.size_bike_inches);
    oneValue = true;
  }
  if (attibutesToUpdate.size_bike) {
    sql += oneValue ? ', size_bike = ? ' : ' size_bike = ? ';
    sqlValues.push(attibutesToUpdate.size_bike);
    oneValue = true;
  }
  if (attibutesToUpdate.size_wheel) {
    sql += oneValue ? ', size_wheel = ? ' : ' size_wheel = ? ';
    sqlValues.push(attibutesToUpdate.size_wheel);
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
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
  validateSize,
};
