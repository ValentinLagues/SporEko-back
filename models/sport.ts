import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import ISport from '../interfaces/ISport';
import multer from 'multer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateSport = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_sport: Joi.number(),
    name: Joi.string().max(80).presence(presence),
    icon: Joi.string().max(255).presence(presence),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const sport = req.body as ISport;
    const sportWithSameName: ISport = await getByName(sport.name);
    if (
      sportWithSameName &&
      Number(sportWithSameName.id_sport) !== sport.id_sport
    ) {
      next(new ErrorHandler(409, `Sport name already exists`));
    } else {
      next();
    }
  })();
};

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './imageSport');
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (
  _req: Request,
  file: { mimetype: string },
  cb: CallableFunction
) => {
  //reject file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('error'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 167 },
  fileFilter: fileFilter,
});

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string
): Promise<ISport[]> => {
  let sql = `SELECT *, id_sport as id FROM sports`;

  if (!sortBy) {
    sql += ` ORDER BY id_sport ASC`;
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
    .query<ISport[]>(sql)
    .then(([results]) => results);
};

const getById = (idSport: number): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE id_sport = ?', [idSport])
    .then(([results]) => results[0]);
};

const getByName = (name: string): Promise<ISport> => {
  return connection
    .promise()
    .query<ISport[]>('SELECT * FROM sports WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const create = (newSport: ISport): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO sports (name, icon) VALUES (?, ?)', [
      newSport.name,
      newSport.icon,
    ])
    .then(([results]) => results.insertId);
};

const update = (
  idSport: number,
  attributesToUpdate: ISport
): Promise<boolean> => {
  let sql = 'UPDATE sports SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attributesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attributesToUpdate.name);
    oneValue = true;
  }
  if (attributesToUpdate.icon) {
    sql += oneValue ? ', icon = ? ' : ' icon = ? ';
    sqlValues.push(attributesToUpdate.icon as string);
    oneValue = true;
  }
  sql += ' WHERE id_sport = ?';
  sqlValues.push(idSport);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const updateImage = (idSport: number, icon: string): Promise<boolean> => {
  const sql = 'UPDATE sports SET icon = ? WHERE id_sport = ? ';

  return connection
    .promise()
    .query<ResultSetHeader>(sql, [icon, idSport])
    .then(([results]) => results.affectedRows === 1);
};

const destroy = (idSport: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM sports WHERE id_sport = ?', [idSport])
    .then(([results]) => results.affectedRows === 1);
};

export default {
  upload,
  getAll,
  getById,
  getByName,
  nameIsFree,
  create,
  update,
  updateImage,
  destroy,
  validateSport,
};
