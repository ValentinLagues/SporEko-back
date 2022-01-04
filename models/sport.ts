import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISport from '../interfaces/ISport';

const validateSport = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(80).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAll = async (): Promise<ISport[]> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports')
    .then(([results]) => results);
};

const getById = async (idSport: number): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE id_sport = ?', [idSport])
    .then(([results]) => results[0]);
};

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  async () => {
    const sport = req.body as ISport;
    const sportWithSameName: ISport = await getByName(sport.name);
    if (sportWithSameName) {
      next(new ErrorHandler(409, `Ce sport existe déjà`));
    } else {
      next();
    }
  };
};

const getByName = async (name: string): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = async (newSport: ISport): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO sports (name) VALUES (?)', [
      newSport.name,
    ])
    .then(([results]) => results.insertId);
};

const update = async (
  idSport: number,
  attibutesToUpdate: ISport
): Promise<boolean> => {
  let sql = 'UPDATE sports SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  sql += ' WHERE id_sport = ?';
  sqlValues.push(idSport);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idSport: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sports WHERE id_sport = ?', [idSport])
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
  validateSport,
};

// const JoiSport = require('joi');
// const dbSport = require('../db-config');

// const connectDbSport = dbSport.connection.promise();

// const validateSport = (data: object, forCreation = true) => {
//     const presence = forCreation ? 'required' : 'optional';
//     return JoiSport.object({
//       name: JoiSport.string().max(50).presence(presence),
//     }).validate(data, { abortEarly: false }).error;
//   };

//   const findManySport = () => {
//     return connectDbSport.query('SELECT * FROM sports');
//   };

//   const findOneSport = (id: number) => {
//     return connectDbSport.query('SELECT * FROM sports WHERE id_sport = ?', [id]);
//   };

//   const createSport = (newSport: object) => {
//     return connectDbSport.query('INSERT INTO sports SET ?', [newSport]);
//   };

//   const updateSport = (id: number, newAttributes: object) => {
//     return connectDbSport.query('UPDATE sports SET ? WHERE id_sport = ?', [
//       newAttributes,
//       id,
//     ]);
//   };

//   const destroySport = (id: number) => {
//     return connectDbSport
//       .query('DELETE FROM sports WHERE id_sport = ?', [id]);
//     //   .then(([result]: Array<any>) => result.affectedRows !== 0);
//   };

//   module.exports = {
//     findManySport,
//     findOneSport,
//     createSport,
//     updateSport,
//     destroySport,
//     validateSport,
//   };
