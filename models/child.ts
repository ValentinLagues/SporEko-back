import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IChild from '../interfaces/IChild';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateChild = (req: Request, res: Response, next: NextFunction) => {
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

const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const child = req.body as IChild;
    const childWithSameName: IChild = await getChildByName(child.name);
    if (childWithSameName) {
      next(new ErrorHandler(409, `Ce nom de genre existe déjà`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllChildren = (): Promise<IChild[]> => {
  return connection
    .promise()
    .query<IChild[]>('SELECT * FROM children')
    .then(([results]) => results);
};

const getChildById = (id: number): Promise<IChild> => {
  return connection
    .promise()
    .query<IChild[]>('SELECT * FROM children WHERE id_child = ? ', [id])
    .then(([result]) => result[0]);
};

const getChildByName = (name: string) => {
  return connection
    .promise()
    .query<IChild[]>('SELECT * FROM children WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const createChild = (newChild: IChild): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO children SET name = ? ', [
      newChild.name,
    ])
    .then(([results]) => results.insertId);
};

const updateChild = (id: number, name: string): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'UPDATE children SET name = ?  WHERE id_child = ? ',
      [name, id]
    )
    .then(([results]) => results.affectedRows === 1);
};

const deleteChild = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM children WHERE id_child = ?', [id])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getChildByName,
  getAllChildren,
  nameIsFree,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
  validateChild,
};
