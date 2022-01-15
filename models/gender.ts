import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IGender from '../interfaces/IGender';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateGender = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    adult_name: Joi.string().max(50).presence(required),
    child_name: Joi.string().max(50).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllGenders = (
  sortBy: string = 'id_gender',
  order: string = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IGender[]> => {
  let sql = `SELECT * FROM genders ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_gender';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IGender[]>(sql)
    .then(([results]) => results);
};

const getGenderById = (id: number): Promise<IGender> => {
  return connection
    .promise()
    .query<IGender[]>('SELECT * FROM genders WHERE id_gender = ? ', [id])
    .then(([result]) => result[0]);
};

const createGender = (newGender: IGender): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO genders (adult_name, child_name) VALUES (?, ?)',
      [newGender.adult_name, newGender.child_name]
    )
    .then(([results]) => results.insertId);
};

const updateGender = (
  id: number,
  adult_name: string,
  child_name: string
): Promise<boolean> => {
  let sql = 'UPDATE genders SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (adult_name) {
    sql += 'adult_name = ? ';
    sqlValues.push(adult_name);
    oneValue = true;
  }
  if (child_name) {
    sql += oneValue ? ', child_name = ? ' : ' child_name = ? ';
    sqlValues.push(child_name);
    oneValue = true;
  }
  sql += ' WHERE id_gender = ?';
  sqlValues.push(id);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const deleteGender = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM genders WHERE id_gender = ?', [id])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAllGenders,
  getGenderById,
  createGender,
  updateGender,
  deleteGender,
  validateGender,
};
