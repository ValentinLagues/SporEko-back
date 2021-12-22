import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IBrand from '../interfaces/IBrand';

const validateBrand = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    name: Joi.string().max(150).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};

const getAllBrands = (): Promise<IBrand[]> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands')
    .then(([results]) => results);
};

const getBrandById = (idbrand: number): Promise<IBrand> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands WHERE id_brand = ?', [
      idbrand,
    ])
    .then(([results]) => results[0]);
};

const brandNameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const brand = req.body as IBrand;
  const brandWithSameName: IBrand = await getByBrandName(brand.name);
  if (brandWithSameName) {
    next(new ErrorHandler(409, `Cette marque existe déjà dans la BDD`));
  } else {
    next();
  }
};

const getByBrandName = (name: string): Promise<IBrand> => {
  return connection
    .promise()
    .query<IBrand[]>('SELECT * FROM brands WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const createBrand = (brand: IBrand): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO brands (name) VALUES (?)', [brand.name])
    .then(([results]) => results.insertId);
};

const updateBrand = (
  idbrand: number,
  newAttributes: IBrand
): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('UPDATE brands SET name = ? WHERE id_brand = ?', [
      newAttributes,
      idbrand,
    ])
    .then(([results]) => results.affectedRows === 1);
};

const destroyBrand = async (idbrand: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM brands WHERE id_brand = ?', [
      idbrand,
    ])
    .then(([results]) => results.affectedRows === 1);
};

export {
  validateBrand,
  getAllBrands,
  getBrandById,
  brandNameIsFree,
  getByBrandName,
  createBrand,
  updateBrand,
  destroyBrand
};
