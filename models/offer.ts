import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';
import IOffer from '../interfaces/IOffer';

/* ------------------------------------------------Midlleware----------------------------------------------------------- */

const validateOffer = (req: Request, res: Response, next: NextFunction) => {
  let presence: Joi.PresenceMode = 'optional';
  if (req.method === 'POST') {
    presence = 'required';
  }
  const errors = Joi.object({
    id_offer: Joi.number().integer(),
    creation_date: Joi.string().max(255),
    id_user_seller: Joi.number().integer().presence(presence),
    picture1: Joi.string().max(255).presence(presence),
    title: Joi.string().max(255).presence(presence),
    description: Joi.string().max(5000).presence(presence),
    id_sport: Joi.number().integer().presence(presence),
    id_gender: Joi.number().integer().presence(presence),
    id_child: Joi.number().integer(),
    id_category: Joi.number().integer().presence(presence),
    id_clothes: Joi.number().integer(),
    id_shoe: Joi.number().integer(),
    id_accessory: Joi.number().integer(),
    id_brand: Joi.number().integer(),
    id_textile: Joi.number().integer(),
    id_size: Joi.number().integer(),
    id_color1: Joi.number().integer(),
    id_color2: Joi.number().integer(),
    id_condition: Joi.number().integer().presence(presence),
    price: Joi.number().positive().precision(2).strict().presence(presence),
    id_weight: Joi.number().integer().presence(presence),
    id_user_buyer: Joi.number().integer(),
    purchase_date: Joi.string().max(255),
    hand_delivery: Joi.number().integer().min(0).max(1).presence(presence),
    colissimo_delivery: Joi.number().integer().min(0).max(1).presence(presence),
    mondial_relay_delivery: Joi.number()
      .integer()
      .min(0)
      .max(1)
      .presence(presence),
    isarchived: Joi.number().integer().min(0).max(1).presence(presence),
    isdraft: Joi.number().integer().min(0).max(1).presence(presence),
    picture2: Joi.string().max(255),
    picture3: Joi.string().max(255),
    picture4: Joi.string().max(255),
    picture5: Joi.string().max(255),
    picture6: Joi.string().max(255),
    picture7: Joi.string().max(255),
    picture8: Joi.string().max(255),
    picture9: Joi.string().max(255),
    picture10: Joi.string().max(255),
    picture11: Joi.string().max(255),
    picture12: Joi.string().max(255),
    picture13: Joi.string().max(255),
    picture14: Joi.string().max(255),
    picture15: Joi.string().max(255),
    picture16: Joi.string().max(255),
    picture17: Joi.string().max(255),
    picture18: Joi.string().max(255),
    picture19: Joi.string().max(255),
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
      next(new ErrorHandler(404, `Couleur non trouvée`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = async (): Promise<IOffer[]> => {
  return connection
    .promise()
    .query<IOffer[]>(
      'select * from offers as o INNER JOIN sports as s on (o.id_sport = s.id_sport)'
    )
    .then(([results]) => results);
};

const getById = async (idOffer: number): Promise<IOffer> => {
  return connection
    .promise()
    .query<IOffer[]>('SELECT * FROM offers WHERE id_offer = ?', [idOffer])
    .then(([results]) => results[0]);
};

const create = async (newOffer: IOffer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO offers SET ?', [newOffer])
    .then(([results]) => results.insertId);
};

const update = async (
  idOffer: number,
  attibutesToUpdate: IOffer
): Promise<boolean> => {
  let sql = 'UPDATE offers SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.picture1) {
    sql += 'picture1 = ? ';
    sqlValues.push(attibutesToUpdate.picture1);
    oneValue = true;
  }
  if (attibutesToUpdate.title) {
    sql += oneValue ? ', title = ? ' : ' title = ? ';
    sqlValues.push(attibutesToUpdate.title);
    oneValue = true;
  }
  if (attibutesToUpdate.description) {
    sql += oneValue ? ', description = ? ' : ' description = ? ';
    sqlValues.push(attibutesToUpdate.description);
    oneValue = true;
  }
  if (attibutesToUpdate.id_sport) {
    sql += oneValue ? ', id_sport = ? ' : ' id_sport = ? ';
    sqlValues.push(attibutesToUpdate.id_sport);
    oneValue = true;
  }
  if (attibutesToUpdate.id_gender) {
    sql += oneValue ? ', id_gender = ? ' : ' id_gender = ? ';
    sqlValues.push(attibutesToUpdate.id_gender);
    oneValue = true;
  }
  if (attibutesToUpdate.id_child) {
    sql += oneValue ? ', id_child = ? ' : ' id_child = ? ';
    sqlValues.push(attibutesToUpdate.id_child);
    oneValue = true;
  }
  if (attibutesToUpdate.id_category) {
    sql += oneValue ? ', id_category = ? ' : ' id_category = ? ';
    sqlValues.push(attibutesToUpdate.id_category);
    oneValue = true;
  }
  if (attibutesToUpdate.id_clothes) {
    sql += oneValue ? ', id_clothes = ? ' : ' id_clothes = ? ';
    sqlValues.push(attibutesToUpdate.id_clothes);
    oneValue = true;
  }
  if (attibutesToUpdate.id_shoe) {
    sql += oneValue ? ', id_shoe = ? ' : ' id_shoe = ? ';
    sqlValues.push(attibutesToUpdate.id_shoe);
    oneValue = true;
  }
  if (attibutesToUpdate.id_accessory) {
    sql += oneValue ? ', id_accessory = ? ' : ' id_accessory = ? ';
    sqlValues.push(attibutesToUpdate.id_accessory);
    oneValue = true;
  }
  if (attibutesToUpdate.id_brand) {
    sql += oneValue ? ', id_brand = ? ' : ' id_brand = ? ';
    sqlValues.push(attibutesToUpdate.id_brand);
    oneValue = true;
  }
  if (attibutesToUpdate.id_textile) {
    sql += oneValue ? ', id_textile = ? ' : ' id_textile = ? ';
    sqlValues.push(attibutesToUpdate.id_textile);
    oneValue = true;
  }
  if (attibutesToUpdate.id_size) {
    sql += oneValue ? ', id_size = ? ' : ' id_size = ? ';
    sqlValues.push(attibutesToUpdate.id_size);
    oneValue = true;
  }
  if (attibutesToUpdate.id_color1) {
    sql += oneValue ? ', id_color1 = ? ' : ' id_color1 = ? ';
    sqlValues.push(attibutesToUpdate.id_color1);
    oneValue = true;
  }
  if (attibutesToUpdate.id_color2) {
    sql += oneValue ? ', id_color2 = ? ' : ' id_color2 = ? ';
    sqlValues.push(attibutesToUpdate.id_color2);
    oneValue = true;
  }
  if (attibutesToUpdate.id_condition) {
    sql += oneValue ? ', id_condition = ? ' : ' id_condition = ? ';
    sqlValues.push(attibutesToUpdate.id_condition);
    oneValue = true;
  }
  if (attibutesToUpdate.price) {
    sql += oneValue ? ', price = ? ' : ' price = ? ';
    sqlValues.push(attibutesToUpdate.price);
    oneValue = true;
  }
  if (attibutesToUpdate.id_weight) {
    sql += oneValue ? ', id_weight = ? ' : ' id_weight = ? ';
    sqlValues.push(attibutesToUpdate.id_weight);
    oneValue = true;
  }
  if (attibutesToUpdate.id_user_buyer) {
    sql += oneValue ? ', id_user_buyer = ? ' : ' id_user_buyer = ? ';
    sqlValues.push(attibutesToUpdate.id_user_buyer);
    oneValue = true;
  }
  if (attibutesToUpdate.purchase_date) {
    sql += oneValue ? ', purchase_date = ? ' : ' purchase_date = ? ';
    sqlValues.push(attibutesToUpdate.purchase_date);
    oneValue = true;
  }
  if (attibutesToUpdate.hand_delivery) {
    sql += oneValue ? ', hand_delivery = ? ' : ' hand_delivery = ? ';
    sqlValues.push(attibutesToUpdate.hand_delivery);
    oneValue = true;
  }
  if (attibutesToUpdate.colissimo_delivery) {
    sql += oneValue ? ', colissimo_delivery = ? ' : ' colissimo_delivery = ? ';
    sqlValues.push(attibutesToUpdate.colissimo_delivery);
    oneValue = true;
  }
  if (attibutesToUpdate.mondial_relay_delivery) {
    sql += oneValue
      ? ', mondial_relay_delivery = ? '
      : ' mondial_relay_delivery = ? ';
    sqlValues.push(attibutesToUpdate.mondial_relay_delivery);
    oneValue = true;
  }
  if (attibutesToUpdate.isarchived) {
    sql += oneValue ? ', isarchived = ? ' : ' isarchived = ? ';
    sqlValues.push(attibutesToUpdate.isarchived);
    oneValue = true;
  }
  if (attibutesToUpdate.isdraft) {
    sql += oneValue ? ', isdraft = ? ' : ' isdraft = ? ';
    sqlValues.push(attibutesToUpdate.isdraft);
    oneValue = true;
  }
  if (attibutesToUpdate.picture2) {
    sql += oneValue ? ', picture2 = ? ' : ' picture2 = ? ';
    sqlValues.push(attibutesToUpdate.picture2);
    oneValue = true;
  }
  if (attibutesToUpdate.picture3) {
    sql += oneValue ? ', picture3 = ? ' : ' picture3 = ? ';
    sqlValues.push(attibutesToUpdate.picture3);
    oneValue = true;
  }
  if (attibutesToUpdate.picture4) {
    sql += oneValue ? ', picture4 = ? ' : ' picture4 = ? ';
    sqlValues.push(attibutesToUpdate.picture4);
    oneValue = true;
  }
  if (attibutesToUpdate.picture5) {
    sql += oneValue ? ', picture5 = ? ' : ' picture5 = ? ';
    sqlValues.push(attibutesToUpdate.picture5);
    oneValue = true;
  }
  if (attibutesToUpdate.picture6) {
    sql += oneValue ? ', picture6 = ? ' : ' picture6 = ? ';
    sqlValues.push(attibutesToUpdate.picture6);
    oneValue = true;
  }
  if (attibutesToUpdate.picture7) {
    sql += oneValue ? ', picture7 = ? ' : ' picture7 = ? ';
    sqlValues.push(attibutesToUpdate.picture7);
    oneValue = true;
  }
  if (attibutesToUpdate.picture8) {
    sql += oneValue ? ', picture8 = ? ' : ' picture8 = ? ';
    sqlValues.push(attibutesToUpdate.picture8);
    oneValue = true;
  }
  if (attibutesToUpdate.picture9) {
    sql += oneValue ? ', picture9 = ? ' : ' picture9 = ? ';
    sqlValues.push(attibutesToUpdate.picture9);
    oneValue = true;
  }
  if (attibutesToUpdate.picture10) {
    sql += oneValue ? ', picture10 = ? ' : ' picture10 = ? ';
    sqlValues.push(attibutesToUpdate.picture10);
    oneValue = true;
  }
  if (attibutesToUpdate.picture11) {
    sql += oneValue ? ', picture11 = ? ' : ' picture11 = ? ';
    sqlValues.push(attibutesToUpdate.picture11);
    oneValue = true;
  }
  if (attibutesToUpdate.picture12) {
    sql += oneValue ? ', picture12 = ? ' : ' picture12 = ? ';
    sqlValues.push(attibutesToUpdate.picture12);
    oneValue = true;
  }
  if (attibutesToUpdate.picture13) {
    sql += oneValue ? ', picture13 = ? ' : ' picture13 = ? ';
    sqlValues.push(attibutesToUpdate.picture13);
    oneValue = true;
  }
  if (attibutesToUpdate.picture14) {
    sql += oneValue ? ', picture14 = ? ' : ' picture14 = ? ';
    sqlValues.push(attibutesToUpdate.picture14);
    oneValue = true;
  }
  if (attibutesToUpdate.picture15) {
    sql += oneValue ? ', picture15 = ? ' : ' picture15 = ? ';
    sqlValues.push(attibutesToUpdate.picture15);
    oneValue = true;
  }
  if (attibutesToUpdate.picture16) {
    sql += oneValue ? ', picture16 = ? ' : ' picture16 = ? ';
    sqlValues.push(attibutesToUpdate.picture16);
    oneValue = true;
  }
  if (attibutesToUpdate.picture17) {
    sql += oneValue ? ', picture17 = ? ' : ' picture17 = ? ';
    sqlValues.push(attibutesToUpdate.picture17);
    oneValue = true;
  }
  if (attibutesToUpdate.picture18) {
    sql += oneValue ? ', picture18 = ? ' : ' picture18 = ? ';
    sqlValues.push(attibutesToUpdate.picture18);
    oneValue = true;
  }
  if (attibutesToUpdate.picture19) {
    sql += oneValue ? ', picture19 = ? ' : ' picture19 = ? ';
    sqlValues.push(attibutesToUpdate.picture19);
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

export {
  getAll,
  getById,
  recordExists,
  create,
  update,
  destroy,
  validateOffer,
};
