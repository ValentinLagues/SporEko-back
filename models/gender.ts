import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IGender from '../interfaces/IGender';
import Joi from 'joi';

const validateGender = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(50).presence(required),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllGenders = () => {
  let sql = 'SELECT * FROM genders';
  return connection.promise().query(sql);
};

const getGenderById = (id: number) => {
  return connection
    .promise()
    .query('SELECT * FROM genders WHERE id_gender = ? ', [id]);
};

const getGenderByName = (name: string) => {
  return connection
    .promise()
    .query('SELECT * FROM genders WHERE name = ?', [name])
    .then(([results]: Array<Array<IGender>>) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const gender = req.body as IGender;
  const genderWithSameName: IGender = await getGenderByName(gender.name);
  if (genderWithSameName) {
    next(new ErrorHandler(409, `Ce nom de genre existe déjà`));
  } else {
    next();
  }
};

const createGender = (name: object) => {
  return connection
    .promise()
    .query('INSERT INTO genders SET ? ', [name])
    .then(([results]: Array<ResultSetHeader>) => results.insertId);
};

const updateGender = (id: number, name: object) => {
  return connection
    .promise()
    .query('UPDATE genders SET name = ?  WHERE id_gender = ? ', [name, id]);
};

const destroyGender = (id: number) => {
  return connection
    .promise()
    .query('DELETE FROM genders WHERE id_gender = ?', [id]);
};

export {
  getGenderByName,
  getAllGenders,
  nameIsFree,
  getGenderById,
  createGender,
  updateGender,
  destroyGender,
  validateGender,
};
