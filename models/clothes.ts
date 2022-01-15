import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import { ErrorHandler } from '../helpers/errors';
import { Request, Response, NextFunction } from 'express';
import IClothes from '../interfaces/IClothes';
import Joi from 'joi';
/* ------------------------------------------------Midlleware----------------------------------------------------------- */
const validateClothes = (req: Request, res: Response, next: NextFunction) => {
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
    const clothes = req.body as IClothes;
    const clothesWithSameName: IClothes = await getClothesByName(clothes.name);
    if (clothesWithSameName) {
      next(new ErrorHandler(409, `Ce nom de genre existe déjà`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */
const getAllClothes = (
  sortBy = 'id_clothes',
  order = 'ASC'
  // firstItem: string,
  // limit: string
): Promise<IClothes[]> => {
  const sql = `SELECT * FROM clothes ORDER BY ${sortBy} ${order}`;
  if (sortBy === 'id') {
    sortBy = 'id_clothes';
  }
  // if (limit) {
  //   sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  // }
  return connection
    .promise()
    .query<IClothes[]>(sql)
    .then(([results]) => results);
};

const getClothesById = (id: number): Promise<IClothes> => {
  return connection
    .promise()
    .query<IClothes[]>('SELECT * FROM clothes WHERE id_clothes = ? ', [id])
    .then(([result]) => result[0]);
};

const getClothesByName = (name: string) => {
  return connection
    .promise()
    .query<IClothes[]>('SELECT * FROM clothes WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const createClothes = (newClothes: IClothes): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO clothes SET name = ? ', [
      newClothes.name,
    ])
    .then(([results]) => results.insertId);
};

const updateClothes = (id: number, name: string): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'UPDATE clothes SET name = ?  WHERE id_clothes = ? ',
      [name, id]
    )
    .then(([results]) => results.affectedRows === 1);
};

const deleteClothes = (id: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM clothes WHERE id_clothes = ?', [id])
    .then(([results]) => results.affectedRows === 1);
};

export {
  getClothesByName,
  getAllClothes,
  nameIsFree,
  getClothesById,
  createClothes,
  updateClothes,
  deleteClothes,
  validateClothes,
};
