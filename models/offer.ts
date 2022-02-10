import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IOffer from '../interfaces/IOffer';
import multer from 'multer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateOffer = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id: Joi.number(),
    id_offer: Joi.number().integer(),
    creation_date: Joi.string().max(255),
    id_user_seller: Joi.number().integer().presence(presence),
    picture1: Joi.string().max(255).presence(presence),
    title: Joi.string().max(255).presence(presence),
    description: Joi.string().max(5000).presence(presence),
    id_sport: Joi.number().integer().presence(presence),
    id_gender: Joi.number().integer().allow(null),
    is_child: Joi.number().integer().min(0).max(1).presence(presence),
    id_category: Joi.number().integer().presence(presence),
    id_item: Joi.number().integer().presence(presence),
    id_brand: Joi.number().integer().allow(null),
    id_textile: Joi.number().integer().allow(null),
    id_size: Joi.number().integer().allow(null),
    id_color1: Joi.number().integer().allow(null),
    id_color2: Joi.number().integer().allow(null),
    id_condition: Joi.number().integer().presence(presence),
    price: Joi.number().precision(2).strict().presence(presence),
    weight: Joi.number().integer(),
    id_user_buyer: Joi.number().integer(),
    purchase_date: Joi.string().max(255),
    is_archived: Joi.number().integer().min(0).max(1).presence(presence),
    is_draft: Joi.number().integer().min(0).max(1).presence(presence),
    picture2: Joi.string().max(255).allow(null),
    picture3: Joi.string().max(255).allow(null),
    picture4: Joi.string().max(255).allow(null),
    picture5: Joi.string().max(255).allow(null),
    picture6: Joi.string().max(255).allow(null),
    picture7: Joi.string().max(255).allow(null),
    picture8: Joi.string().max(255).allow(null),
    picture9: Joi.string().max(255).allow(null),
    picture10: Joi.string().max(255).allow(null),
    picture11: Joi.string().max(255).allow(null),
    picture12: Joi.string().max(255).allow(null),
    picture13: Joi.string().max(255).allow(null),
    picture14: Joi.string().max(255).allow(null),
    picture15: Joi.string().max(255).allow(null),
    picture16: Joi.string().max(255).allow(null),
    picture17: Joi.string().max(255).allow(null),
    picture18: Joi.string().max(255).allow(null),
    picture19: Joi.string().max(255).allow(null),
    picture20: Joi.string().max(255).allow(null),
  }).validate(req.body, { abortEarly: false }).error;
  if (errors) {
    next(new ErrorHandler(422, errors.message));
  } else {
    next();
  }
};
const recordExists = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const offer = req.body as IOffer;
    offer.id_offer = parseInt(req.params.idOffer);
    const recordFound: IOffer = await getById(offer.id_offer);
    if (!recordFound) {
      next(new ErrorHandler(404, `Offer not found`));
    } else {
      next();
    }
  })();
};

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './imagesOffers');
  },
  filename: function (_req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
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
    cb(new Error('error!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = async (
  sortBy: string,
  order: string,
  firstItem: string,
  limit: string,
  id_user_seller: number,
  title: string,
  id_sport: number,
  id_gender: number,
  is_child: number,
  id_category: number,
  id_item: number,
  id_brand: number,
  id_textile: number,
  id_size: number,
  id_color1: number,
  id_condition: number,
  minPrice: number,
  maxPrice: number
): Promise<IOffer[]> => {
  let sql = `SELECT o.*, o.id_offer as id, 
  CASE WHEN s.id_size_type = 1 THEN s.size_eu 
  WHEN s.id_size_type = 2 OR s.id_size_type = 3 THEN CONCAT(s.size_int, '/', s.size_eu, '/', s.size_uk) 
  WHEN s.id_size_type = 6 THEN s.age_child 
  END AS size 
  FROM offers o 
  LEFT JOIN sizes s ON o.id_size = s.id_size 
  LEFT JOIN items i ON i.id_size_type = s.id_size_type AND i.id_item = o.id_item`;
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (id_user_seller) {
    sql += ` WHERE id_user_seller = ?`;
    sqlValues.push(id_user_seller);
    oneValue = true;
  }
  if (title) {
    sql += oneValue ? ` AND o.title LIKE ?` : ` WHERE o.title LIKE ?`;
    title = '%' + title + '%';
    sqlValues.push(title);
    oneValue = true;
  }
  if (id_sport) {
    sql += oneValue ? ` AND o.id_sport = ?` : ` WHERE o.id_sport = ?`;
    sqlValues.push(id_sport);
    oneValue = true;
  }
  if (id_gender) {
    sql += oneValue ? ` AND o.id_gender = ?` : ` WHERE o.id_gender = ?`;
    sqlValues.push(id_gender);
    oneValue = true;
  }
  if (is_child) {
    sql += oneValue ? ` AND o.is_child = ?` : ` WHERE o.is_child = ?`;
    sqlValues.push(is_child);
    oneValue = true;
  }
  if (id_category) {
    sql += oneValue ? ` AND o.id_category = ?` : ` WHERE o.id_category = ?`;
    sqlValues.push(id_category);
    oneValue = true;
  }
  if (id_item) {
    sql += oneValue ? ` AND o.id_item = ?` : ` WHERE o.id_item = ?`;
    sqlValues.push(id_item);
    oneValue = true;
  }
  if (id_brand) {
    sql += oneValue ? ` AND o.id_brand = ?` : ` WHERE o.id_brand = ?`;
    sqlValues.push(id_brand);
    oneValue = true;
  }
  if (id_textile) {
    sql += oneValue ? ` AND o.id_textile = ?` : ` WHERE o.id_textile = ?`;
    sqlValues.push(id_textile);
    oneValue = true;
  }
  if (id_size) {
    sql += oneValue ? ` AND o.id_size = ?` : ` WHERE o.id_size = ?`;
    sqlValues.push(id_size);
    oneValue = true;
  }
  if (id_color1) {
    sql += oneValue
      ? ` AND o.id_color1 = ? OR o.id_color2 = ?`
      : ` WHERE o.id_color1 = ? OR o.id_color2 = ?`;
    sqlValues.push(id_color1, id_color1);
    oneValue = true;
  }
  if (id_condition) {
    sql += oneValue ? ` AND o.id_condition = ?` : ` WHERE o.id_condition = ?`;
    sqlValues.push(id_condition);
    oneValue = true;
  }

  if (minPrice || minPrice === 0) {
    if (maxPrice) {
      sql += oneValue
        ? ` AND o.price BETWEEN ? AND ?`
        : ` WHERE o.price BETWEEN ? AND ?`;
      sqlValues.push(minPrice, maxPrice);
      oneValue = true;
    } else {
      // for > 100€ value (no max)
      sql += oneValue ? ` AND o.price > ?` : ` WHERE o.price > ?`;
      sqlValues.push(minPrice);
      oneValue = true;
    }
  }

  if (!sortBy) {
    sql += ` ORDER BY creation_date DESC`;
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
    .query<IOffer[]>(sql, sqlValues)
    .then(([results]) => {
      return results;
    });
};

const getById = async (idOffer: number): Promise<IOffer> => {
  const sql = `SELECT o.*, o.id_offer as id, 
  CASE WHEN s.id_size_type = 1 THEN s.size_eu 
  WHEN s.id_size_type = 2 OR s.id_size_type = 3 THEN CONCAT(s.size_int, '/', s.size_eu, '/', s.size_uk) 
  WHEN s.id_size_type = 6 THEN s.age_child 
  END AS size 
  FROM offers o 
  LEFT JOIN sizes s ON o.id_size = s.id_size 
  LEFT JOIN items i ON i.id_size_type = s.id_size_type AND i.id_item = o.id_item WHERE id_offer = ?`;
  return connection
    .promise()
    .query<IOffer[]>(sql, [idOffer])
    .then(([results]) => results[0]);
};

const getOffersByIdUser = async (idOffer: number): Promise<IOffer[]> => {
  const sql = `SELECT o.*, o.id_offer as id, 
  CASE WHEN s.id_size_type = 1 THEN s.size_eu 
  WHEN s.id_size_type = 2 OR s.id_size_type = 3 THEN CONCAT(s.size_int, '/', s.size_eu, '/', s.size_uk) 
  WHEN s.id_size_type = 6 THEN s.age_child 
  END AS size 
  FROM offers o 
  LEFT JOIN sizes s ON o.id_size = s.id_size 
  LEFT JOIN items i ON i.id_size_type = s.id_size_type AND i.id_item = o.id_item WHERE id_user_seller = ? or id_user_buyer = ?`;
  return connection
    .promise()
    .query<IOffer[]>(sql, [idOffer, idOffer])
    .then(([results]) => results);
};

const create = async (newOffer: IOffer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO offers (id_user_seller, picture1, title, description, id_sport, id_gender, is_child, id_category, id_item, id_brand, id_textile, id_size, id_color1, id_color2, id_condition, price, weight, is_archived, is_draft, picture2, picture3, picture4, picture5, picture6, picture7, picture8, picture9, picture10, picture11, picture12, picture13, picture14, picture15, picture16, picture17, picture18, picture19, picture20) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newOffer.id_user_seller,
        newOffer.picture1,
        newOffer.title,
        newOffer.description,
        newOffer.id_sport,
        newOffer.id_gender,
        newOffer.is_child,
        newOffer.id_category,
        newOffer.id_item,
        newOffer.id_brand,
        newOffer.id_textile,
        newOffer.id_size,
        newOffer.id_color1,
        newOffer.id_color2,
        newOffer.id_condition,
        newOffer.price,
        newOffer.weight,
        newOffer.is_archived,
        newOffer.is_draft,
        newOffer.picture2,
        newOffer.picture3,
        newOffer.picture4,
        newOffer.picture5,
        newOffer.picture6,
        newOffer.picture7,
        newOffer.picture8,
        newOffer.picture9,
        newOffer.picture10,
        newOffer.picture11,
        newOffer.picture12,
        newOffer.picture13,
        newOffer.picture14,
        newOffer.picture15,
        newOffer.picture16,
        newOffer.picture17,
        newOffer.picture18,
        newOffer.picture19,
        newOffer.picture20,
      ]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idOffer: number,
  attributesToUpdate: IOffer
): Promise<boolean> => {
  let sql = 'UPDATE offers SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attributesToUpdate.picture1) {
    sql += 'picture1 = ? ';
    sqlValues.push(attributesToUpdate.picture1);
    oneValue = true;
  }
  if (attributesToUpdate.title) {
    sql += oneValue ? ', title = ? ' : ' title = ? ';
    sqlValues.push(attributesToUpdate.title);
    oneValue = true;
  }
  if (attributesToUpdate.description) {
    sql += oneValue ? ', description = ? ' : ' description = ? ';
    sqlValues.push(attributesToUpdate.description);
    oneValue = true;
  }
  if (attributesToUpdate.id_sport) {
    sql += oneValue ? ', id_sport = ? ' : ' id_sport = ? ';
    sqlValues.push(attributesToUpdate.id_sport);
    oneValue = true;
  }
  if (attributesToUpdate.id_gender) {
    sql += oneValue ? ', id_gender = ? ' : ' id_gender = ? ';
    sqlValues.push(attributesToUpdate.id_gender);
    oneValue = true;
  }
  if (attributesToUpdate.is_child) {
    sql += oneValue ? ', is_child = ? ' : ' is_child = ? ';
    sqlValues.push(attributesToUpdate.is_child);
    oneValue = true;
  }
  if (attributesToUpdate.id_category) {
    sql += oneValue ? ', id_category = ? ' : ' id_category = ? ';
    sqlValues.push(attributesToUpdate.id_category);
    oneValue = true;
  }
  if (attributesToUpdate.id_item) {
    sql += oneValue ? ', id_item = ? ' : ' id_item = ? ';
    sqlValues.push(attributesToUpdate.id_item);
    oneValue = true;
  }
  if (attributesToUpdate.id_brand) {
    sql += oneValue ? ', id_brand = ? ' : ' id_brand = ? ';
    sqlValues.push(attributesToUpdate.id_brand);
    oneValue = true;
  }
  if (attributesToUpdate.id_textile) {
    sql += oneValue ? ', id_textile = ? ' : ' id_textile = ? ';
    sqlValues.push(attributesToUpdate.id_textile);
    oneValue = true;
  }
  if (attributesToUpdate.id_size) {
    sql += oneValue ? ', id_size = ? ' : ' id_size = ? ';
    sqlValues.push(attributesToUpdate.id_size);
    oneValue = true;
  }
  if (attributesToUpdate.id_color1) {
    sql += oneValue ? ', id_color1 = ? ' : ' id_color1 = ? ';
    sqlValues.push(attributesToUpdate.id_color1);
    oneValue = true;
  }
  if (attributesToUpdate.id_color2) {
    sql += oneValue ? ', id_color2 = ? ' : ' id_color2 = ? ';
    sqlValues.push(attributesToUpdate.id_color2);
    oneValue = true;
  }
  if (attributesToUpdate.id_condition) {
    sql += oneValue ? ', id_condition = ? ' : ' id_condition = ? ';
    sqlValues.push(attributesToUpdate.id_condition);
    oneValue = true;
  }
  if (attributesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attributesToUpdate.price);
    oneValue = true;
  }
  if (attributesToUpdate.id_weight) {
    sql += oneValue ? ', id_weight = ? ' : ' id_weight = ? ';
    sqlValues.push(attributesToUpdate.id_weight);
    oneValue = true;
  }
  if (attributesToUpdate.id_user_buyer) {
    sql += oneValue ? ', id_user_buyer = ? ' : ' id_user_buyer = ? ';
    sqlValues.push(attributesToUpdate.id_user_buyer);
    oneValue = true;
  }
  if (attributesToUpdate.purchase_date) {
    sql += oneValue ? ', purchase_date = ? ' : ' purchase_date = ? ';
    sqlValues.push(attributesToUpdate.purchase_date);
    oneValue = true;
  }
  if (attributesToUpdate.is_archived) {
    sql += oneValue ? ', is_archived = ? ' : ' is_archived = ? ';
    sqlValues.push(attributesToUpdate.is_archived);
    oneValue = true;
  }
  if (attributesToUpdate.is_draft) {
    sql += oneValue ? ', is_draft = ? ' : ' is_draft = ? ';
    sqlValues.push(attributesToUpdate.is_draft);
    oneValue = true;
  }
  if (attributesToUpdate.picture2) {
    sql += oneValue ? ', picture2 = ? ' : ' picture2 = ? ';
    sqlValues.push(attributesToUpdate.picture2);
    oneValue = true;
  }
  if (attributesToUpdate.picture3) {
    sql += oneValue ? ', picture3 = ? ' : ' picture3 = ? ';
    sqlValues.push(attributesToUpdate.picture3);
    oneValue = true;
  }
  if (attributesToUpdate.picture4) {
    sql += oneValue ? ', picture4 = ? ' : ' picture4 = ? ';
    sqlValues.push(attributesToUpdate.picture4);
    oneValue = true;
  }
  if (attributesToUpdate.picture5) {
    sql += oneValue ? ', picture5 = ? ' : ' picture5 = ? ';
    sqlValues.push(attributesToUpdate.picture5);
    oneValue = true;
  }
  if (attributesToUpdate.picture6) {
    sql += oneValue ? ', picture6 = ? ' : ' picture6 = ? ';
    sqlValues.push(attributesToUpdate.picture6);
    oneValue = true;
  }
  if (attributesToUpdate.picture7) {
    sql += oneValue ? ', picture7 = ? ' : ' picture7 = ? ';
    sqlValues.push(attributesToUpdate.picture7);
    oneValue = true;
  }
  if (attributesToUpdate.picture8) {
    sql += oneValue ? ', picture8 = ? ' : ' picture8 = ? ';
    sqlValues.push(attributesToUpdate.picture8);
    oneValue = true;
  }
  if (attributesToUpdate.picture9) {
    sql += oneValue ? ', picture9 = ? ' : ' picture9 = ? ';
    sqlValues.push(attributesToUpdate.picture9);
    oneValue = true;
  }
  if (attributesToUpdate.picture10) {
    sql += oneValue ? ', picture10 = ? ' : ' picture10 = ? ';
    sqlValues.push(attributesToUpdate.picture10);
    oneValue = true;
  }
  if (attributesToUpdate.picture11) {
    sql += oneValue ? ', picture11 = ? ' : ' picture11 = ? ';
    sqlValues.push(attributesToUpdate.picture11);
    oneValue = true;
  }
  if (attributesToUpdate.picture12) {
    sql += oneValue ? ', picture12 = ? ' : ' picture12 = ? ';
    sqlValues.push(attributesToUpdate.picture12);
    oneValue = true;
  }
  if (attributesToUpdate.picture13) {
    sql += oneValue ? ', picture13 = ? ' : ' picture13 = ? ';
    sqlValues.push(attributesToUpdate.picture13);
    oneValue = true;
  }
  if (attributesToUpdate.picture14) {
    sql += oneValue ? ', picture14 = ? ' : ' picture14 = ? ';
    sqlValues.push(attributesToUpdate.picture14);
    oneValue = true;
  }
  if (attributesToUpdate.picture15) {
    sql += oneValue ? ', picture15 = ? ' : ' picture15 = ? ';
    sqlValues.push(attributesToUpdate.picture15);
    oneValue = true;
  }
  if (attributesToUpdate.picture16) {
    sql += oneValue ? ', picture16 = ? ' : ' picture16 = ? ';
    sqlValues.push(attributesToUpdate.picture16);
    oneValue = true;
  }
  if (attributesToUpdate.picture17) {
    sql += oneValue ? ', picture17 = ? ' : ' picture17 = ? ';
    sqlValues.push(attributesToUpdate.picture17);
    oneValue = true;
  }
  if (attributesToUpdate.picture18) {
    sql += oneValue ? ', picture18 = ? ' : ' picture18 = ? ';
    sqlValues.push(attributesToUpdate.picture18);
    oneValue = true;
  }
  if (attributesToUpdate.picture19) {
    sql += oneValue ? ', picture19 = ? ' : ' picture19 = ? ';
    sqlValues.push(attributesToUpdate.picture19);
    oneValue = true;
  }
  if (attributesToUpdate.picture20) {
    sql += oneValue ? ', picture20 = ? ' : ' picture20 = ? ';
    sqlValues.push(attributesToUpdate.picture20);
    oneValue = true;
  }

  sql += ' WHERE id_offer = ?';
  sqlValues.push(idOffer);

  return connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues)
    .then(([results]) => results.affectedRows === 1);
};

const destroy = async (idOffer: number): Promise<boolean> => {
  return connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM offers WHERE id_offer = ?', [idOffer])
    .then(([results]) => results.affectedRows === 1);
};

export default {
  getAll,
  getById,
  getOffersByIdUser,
  recordExists,
  create,
  update,
  destroy,
  validateOffer,
  upload,
};
