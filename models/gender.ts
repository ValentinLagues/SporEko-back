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

const getAllGenders = (): Promise<IGender[]> => {
  return connection
    .promise()
    .query<IGender[]>('SELECT * FROM genders')
    .then(([results]) => results);
};

const getGenderById = (id: number): Promise<IGender> => {
  return connection
    .promise()
    .query<IGender[]>('SELECT * FROM genders WHERE id_gender = ? ', [id])
    .then(([result]) => result[0]);
};

const getGenderByName = (name: string) => {
  return connection
    .promise()
    .query<IGender[]>('SELECT * FROM genders WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  async () => {
    const gender = req.body as IGender;
    const genderWithSameName: IGender = await getGenderByName(gender.name);
    if (genderWithSameName) {
      next(new ErrorHandler(409, `Ce nom de genre existe déjà`));
    } else {
      next();
    }
  };
};

const createGender = (newGender: IGender): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO genders SET name = ? ', [
      newGender.name,
    ])
    .then(([results]) => results.insertId);
};

const updateGender = (id: number, name: string): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'UPDATE genders SET name = ?  WHERE id_gender = ? ',
      [name, id]
    )
    .then(([results]) => results.affectedRows === 1);
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