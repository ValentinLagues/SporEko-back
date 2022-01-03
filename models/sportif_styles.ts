import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISportifStyles from '../interfaces/ISportifStyles';

const validateSportifStyles = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(200).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAll = (): Promise<ISportifStyles[]> => {
  return connection
    .promise()
    .query<ISportifStyles[]>('SELECT * FROM sportif_styles')
    .then(([results]) => results);
};

const getById = (idSportifStyles: number): Promise<ISportifStyles> => {
  return connection
    .promise()
    .query<ISportifStyles[]>('SELECT * FROM sportif_styles WHERE id_sportif_style = ?', [
      idSportifStyles,
    ])
    .then(([results]) => results[0]);
};

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const sportifStyles = req.body as ISportifStyles;
  const sportifStylesWithSameName: ISportifStyles = await getByName(sportifStyles.name);
  if (sportifStylesWithSameName) {
    next(new ErrorHandler(409, `Ce nom de sportif_styles existe déjà`));
  } else {
    next();
  }
};

const getByName = (name: string): Promise<ISportifStyles> => {
  return connection
    .promise()
    .query<ISportifStyles[]>('SELECT * FROM sportif_styles WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newSportifStyles: ISportifStyles): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO sportif_styles SET ?', [newSportifStyles])
    .then(([results]) => results.insertId);
};

const update = (
  idSportifStyles: number,
  newAttributes: ISportifStyles
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE sportif_styles SET ? WHERE id_sportif_style = ?', [
      newAttributes,
      idSportifStyles,
    ])
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idSportifStyles: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sportif_styles WHERE id_sportif_style = ?', [
      idSportifStyles,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  destroy,
  validateSportifStyles,
};
