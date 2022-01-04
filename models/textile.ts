// const JoiTextile = require('joi');
// const dbTextile = require('../db-config');

// const connectDbTextile = dbTextile.connection.promise();

import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ITextile from '../interfaces/ITextile';

// const validateTextile = (data: object, forCreation = true) => {
//     const presence = forCreation ? 'required' : 'optional';
//     return JoiTextile.object({
//       name: JoiTextile.string().max(80).presence(presence),
//     }).validate(data, { abortEarly: false }).error;
//   };

  const validateTextile = (req: Request, res: Response, next: NextFunction) => {
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

  // const findManyTextile = () => {
  //   return connectDbTextile.query('SELECT * FROM textiles');
  // };

  const getAll = async (): Promise<ITextile[]> => {
    return connection
      .promise()
      .query<ITextile[]>('SELECT * FROM textiles')
      .then(([results]) => results);
  };
  
  // const findOneTextile = (id: number) => {
  //   return connectDbTextile.query('SELECT * FROM textiles WHERE id_textile = ?', [id]);
  // };
  const getById = async (idTextile: number): Promise<ITextile> => {
    return connection
      .promise()
      .query<ITextile[]>('SELECT * FROM textiles WHERE id_textile = ?', [idTextile])
      .then(([results]) => results[0]);
  };

  const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
    const textile = req.body as ITextile;
    const textileWithSameName: ITextile = await getByName(textile.name);
    if (textileWithSameName) {
      next(new ErrorHandler(409, `Cette matière existe déjà`));
    } else {
      next();
    }
  };

  const getByName = async (name: string): Promise<ITextile> => {
    return connection
      .promise()
      .query<ITextile[]>('SELECT * FROM textiles WHERE name = ?', [name])
      .then(([results]) => results[0]);
  };

  const create = async (newTextile: ITextile): Promise<number> => {
    return connection
      .promise()
      .query<ResultSetHeader>(
        'INSERT INTO textiles (name) VALUES (?)',
        [newTextile.name]
      )
      .then(([results]) => results.insertId);
  };

  const update = async (
    idTextile: number,
    attibutesToUpdate: ITextile
  ): Promise<boolean> => {
    let sql = 'UPDATE textiles SET ';
    const sqlValues: Array<string | number> = [];
  
    if (attibutesToUpdate.name) {
      sql += 'name = ? ';
      sqlValues.push(attibutesToUpdate.name);
    }
    sql += ' WHERE id_textile = ?';
    sqlValues.push(idTextile);
  
    return connection
      .promise()
      .query<ResultSetHeader>(sql, sqlValues)
      .then(([results]) => results.affectedRows === 1);
  };

  const destroy = async (idTextile: number): Promise<boolean> => {
    return connection
      .promise()
      .query<ResultSetHeader>('DELETE FROM textiles WHERE id_textile = ?', [idTextile])
      .then(([results]) => results.affectedRows === 1);
  };

  // const createTextile = (newTextile: object) => {
  //   return connectDbTextile.query('INSERT INTO textiles SET ?', [newTextile]);
  // };
  
  // const updateTextile = (id: number, newAttributes: object) => {
  //   return connectDbTextile.query('UPDATE textiles SET ? WHERE id_textile = ?', [
  //     newAttributes,
  //     id,
  //   ]);
  // };

  // const destroyTextile = (id: number) => {
  //   return connectDbTextile
  //     .query('DELETE FROM textiles WHERE id_textile = ?', [id]);
  //   //   .then(([result]: Array<any>) => result.affectedRows !== 0);
  // };

  // module.exports = {
  //   findManyTextile,
  //   findOneTextile,
  //   createTextile,
  //   updateTextile,
  //   destroyTextile,
  //   validateTextile,
  // };

  export {
    getAll,
    getById,
    getByName,
    nameIsFree,
    create,
    update,
    destroy,
    validateTextile,
  };
