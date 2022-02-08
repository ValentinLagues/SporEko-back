import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import { ResultSetHeader } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import Joi from 'joi'; 
import { waitForDebugger } from 'inspector';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSize = (req: Request, res: Response, next: NextFunction) => {
  let required: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    required = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_size: Joi.number().integer(),
    id_gender: Joi.number().integer().allow(null),
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
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string,
  id_item: string,
  id_size: string
): Promise<ISize[]> => {
  let sql = `SELECT *, id_size as id FROM sizes`;
  const sqlValues = [];

  if(id_size && id_item) {
    sql = "SELECT CASE WHEN s.id_size_type = 1 THEN s.size_eu WHEN s.id_size_type = 2 OR s.id_size_type = 3 then CONCAT(s.size_int, '/', s.size_eu, '/', s.size_uk) WHEN s.id_size_type = 6 THEN s.age_child END AS size FROM sizes s INNER JOIN items i ON i.id_size_type = s.id_size_type AND i.id_item = ? AND s.id_size = ?"
    sqlValues.push(id_item, id_size)
  }

  if (!sortBy) {
    sql += ` ORDER BY id_size ASC`;
  }
  if (sortBy) {
    sql += ` ORDER BY ${sortBy} ${order}`;
  }
  if (limit) {
    sql += ` LIMIT ${limit} OFFSET ${firstItem}`;
  }
  sql = sql.replace(/"/g, '');
  return connection
    .promise()
    .query<ISize[]>(sql,sqlValues)
    .then(([results]) => results);
};

const getSizeById = (id: number): Promise<ISize> => {
  return connection
    .promise()
    .query<ISize[]>('SELECT * FROM sizes WHERE id_size = ? ', [id])
    .then(([result]) => result[0])
};

const getSizesBySizeType = (
  idSizeType: number,
  id_gender: number,
  is_child: number
) => {
  let sql = `SELECT * FROM sizes WHERE id_size_type = ?`;
  const sqlValues: Array<string | number> = [idSizeType];

  if (id_gender) {
    sql += ` AND id_gender = ?`;
    sqlValues.push(id_gender);
  }
  if (is_child) {
    sql += ' AND is_child = ? ';
    sqlValues.push(is_child);
  }

  return connection
    .promise()
    .query<ISize[]>(sql, sqlValues)
    .then(([results]) => results);
};

const getSizesByCategory = (
  idCategory: number,
  id_gender: number,
  is_child: number
) => {
  let sql = `SELECT * FROM sizes`;

  if (idCategory === 1 && !id_gender && !is_child) {
    sql += ` WHERE id_size_type = 2 OR id_size_type = 3 OR id_size_type = 6`;
  }
  if (idCategory === 1 && is_child) {
    sql += ` WHERE id_size_type = 6`;
  } else if (idCategory === 1 && id_gender === 1) {
    sql += ` WHERE (id_size_type = 2 OR id_size_type = 3) AND id_gender = 1`;
  } else if (idCategory === 1 && id_gender === 2) {
    sql += ` WHERE (id_size_type = 2 OR id_size_type = 3) AND id_gender = 2`;
  }
  if (idCategory === 2 && !is_child) {
    sql += ` WHERE id_size_type = 1`;
  } else if (idCategory === 2 && is_child) {
    sql += ` WHERE id_size_type = 1 AND is_child = 1`;
  }

  return connection
    .promise()
    .query<ISize[]>(sql)
    .then(([results]) => {
      return results});
};

const create = (newSize: ISize): Promise<number> => {
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
  attributesToUpdate: ISize
): Promise<boolean> => {
  let sql = 'UPDATE sizes SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;
  if (attributesToUpdate.id_gender) {
    sql += 'id_gender = ? ';
    sqlValues.push(attributesToUpdate.id_gender);
    oneValue = true;
  }
  if (attributesToUpdate.is_child) {
    sql += oneValue ? ', is_child = ? ' : ' is_child = ? ';
    sqlValues.push(attributesToUpdate.is_child);
    oneValue = true;
  }
  if (attributesToUpdate.id_sizeType) {
    sql += oneValue ? ', id_sizeType = ? ' : ' id_sizeType = ? ';
    sqlValues.push(attributesToUpdate.id_sizeType);
    oneValue = true;
  }
  if (attributesToUpdate.size_int) {
    sql += oneValue ? ', size_int = ? ' : ' size_int = ? ';
    sqlValues.push(attributesToUpdate.size_int);
    oneValue = true;
  }
  if (attributesToUpdate.size_eu) {
    sql += oneValue ? ', size_eu = ? ' : ' size_eu = ? ';
    sqlValues.push(attributesToUpdate.size_eu);
    oneValue = true;
  }
  if (attributesToUpdate.size_fr) {
    sql += oneValue ? ', size_fr = ? ' : ' size_fr = ? ';
    sqlValues.push(attributesToUpdate.size_fr);
    oneValue = true;
  }
  if (attributesToUpdate.size_uk) {
    sql += oneValue ? ', size_uk = ? ' : ' size_uk = ? ';
    sqlValues.push(attributesToUpdate.size_uk);
    oneValue = true;
  }
  if (attributesToUpdate.size_us) {
    sql += oneValue ? ', size_us = ? ' : ' size_us = ? ';
    sqlValues.push(attributesToUpdate.size_us);
    oneValue = true;
  }
  if (attributesToUpdate.size_foot) {
    sql += oneValue ? ', size_foot = ? ' : ' size_foot = ? ';
    sqlValues.push(attributesToUpdate.size_foot);
    oneValue = true;
  }
  if (attributesToUpdate.size_chest) {
    sql += oneValue ? ', size_chest = ? ' : ' size_chest = ? ';
    sqlValues.push(attributesToUpdate.size_chest);
    oneValue = true;
  }
  if (attributesToUpdate.size_pool) {
    sql += oneValue ? ', size_pool = ? ' : ' size_pool = ? ';
    sqlValues.push(attributesToUpdate.size_pool);
    oneValue = true;
  }
  if (attributesToUpdate.size_jeans) {
    sql += oneValue ? ', size_jeans = ? ' : ' size_jeans = ? ';
    sqlValues.push(attributesToUpdate.size_jeans);
    oneValue = true;
  }
  if (attributesToUpdate.age_child) {
    sql += oneValue ? ', age_child = ? ' : ' age_child = ? ';
    sqlValues.push(attributesToUpdate.age_child);
    oneValue = true;
  }
  if (attributesToUpdate.height) {
    sql += oneValue ? ', height = ? ' : ' height = ? ';
    sqlValues.push(attributesToUpdate.height);
    oneValue = true;
  }
  if (attributesToUpdate.hand_turn) {
    sql += oneValue ? ', hand_turn = ? ' : ' hand_turn = ? ';
    sqlValues.push(attributesToUpdate.hand_turn);
    oneValue = true;
  }
  if (attributesToUpdate.size_glove) {
    sql += oneValue ? ', size_glove = ? ' : ' size_glove = ? ';
    sqlValues.push(attributesToUpdate.size_glove);
    oneValue = true;
  }
  if (attributesToUpdate.crotch) {
    sql += oneValue ? ', crotch = ? ' : ' crotch = ? ';
    sqlValues.push(attributesToUpdate.crotch);
    oneValue = true;
  }
  if (attributesToUpdate.size_bike_inches) {
    sql += oneValue ? ', size_bike_inches = ? ' : ' size_bike_inches = ? ';
    sqlValues.push(attributesToUpdate.size_bike_inches);
    oneValue = true;
  }
  if (attributesToUpdate.size_bike) {
    sql += oneValue ? ', size_bike = ? ' : ' size_bike = ? ';
    sqlValues.push(attributesToUpdate.size_bike);
    oneValue = true;
  }
  if (attributesToUpdate.size_wheel) {
    sql += oneValue ? ', size_wheel = ? ' : ' size_wheel = ? ';
    sqlValues.push(attributesToUpdate.size_wheel);
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

export default {
  getAllSizes,
  getSizeById,
  getSizesBySizeType,
  getSizesByCategory,
  create,
  updateSize,
  deleteSize,
  validateSize,
};
