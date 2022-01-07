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
    name: Joi.string().max(255).presence(presence),
    offer_code: Joi.string().min(7).max(9).presence(presence),
    id_offer: Joi.number(),
    creation_date: Joi.string().max(255).presence(presence),
    title: Joi.string().max(255).presence(presence),
    picture1: Joi.string().max(255).presence(presence),
    price: Joi.number(),
    description: Joi.string().max(255).presence(presence),
    id_sport: Joi.number(),
    id_size: Joi.number(),
    id_condition: Joi.number(),
    id_brand: Joi.number(),
    id_category: Joi.number(),
    id_color: Joi.number(),
    id_textile: Joi.number(),
    id_user_seller: Joi.number(),
    isarchived: Joi.number(),
    ischildren: Joi.number(),
    id_user_buyer: Joi.number(),
    purchase_date: Joi.string().max(255).presence(presence),
    rating_for_seller: Joi.number(),
    title_comment_rating_for_seller: Joi.string().max(255).presence(presence),
    comment_rating_for_seller: Joi.string().max(255).presence(presence),
    answer_from_seller: Joi.string().max(255).presence(presence),
    rating_for_buyer: Joi.number(),
    title_comment_rating_for_buyer: Joi.string().max(255).presence(presence),
    comment_rating_for_buyer: Joi.string().max(255).presence(presence),
    answer_from_buyer: Joi.string().max(255).presence(presence),
    hand_delivery: Joi.number(),
    colissimo_delivery: Joi.number(),
    id_colissimo: Joi.number(),
    mondial_relay_delivery: Joi.number(),
    id_mondial_relay: Joi.number(),
    picture2: Joi.string().max(255).presence(presence),
    picture3: Joi.string().max(255).presence(presence),
    picture4: Joi.string().max(255).presence(presence),
    picture5: Joi.string().max(255).presence(presence),
    picture6: Joi.string().max(255).presence(presence),
    picture7: Joi.string().max(255).presence(presence),
    picture8: Joi.string().max(255).presence(presence),
    picture9: Joi.string().max(255).presence(presence),
    picture10: Joi.string().max(255).presence(presence),
    picture11: Joi.string().max(255).presence(presence),
    picture12: Joi.string().max(255).presence(presence),
    picture13: Joi.string().max(255).presence(presence),
    picture14: Joi.string().max(255).presence(presence),
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
const nameIsFree = (req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    const offer = req.body as IOffer;
    const offerWithSameName: IOffer = await getByName(offer.name);
    if (offerWithSameName) {
      next(new ErrorHandler(409, `Ce nom de couleur existe déjà`));
    } else {
      next();
    }
  })();
};
/* ------------------------------------------------Models----------------------------------------------------------- */

const getAll = async (): Promise<IOffer[]> => {
  return connection
    .promise()
    .query<IOffer[]>('SELECT * FROM offers')
    .then(([results]) => results);
};

const getById = async (idOffer: number): Promise<IOffer> => {
  return connection
    .promise()
    .query<IOffer[]>('SELECT * FROM offers WHERE id_offer = ?', [idOffer])
    .then(([results]) => results[0]);
};

const getByName = async (name: string): Promise<IOffer> => {
  return connection
    .promise()
    .query<IOffer[]>('SELECT * FROM offers WHERE name = ?', [name])
    .then(([results]) => results[0]);
};

const codeIsFree = async (req: Request, res: Response, next: NextFunction) => {
  const offer = req.body as IOffer;
  const offerWithSameCode: IOffer = await getByCode(offer.offer_code);
  if (offerWithSameCode) {
    next(new ErrorHandler(409, `Ce code couleur existe déjà`));
  } else {
    next();
  }
};

const getByCode = async (offer_code: string): Promise<IOffer> => {
  return connection
    .promise()
    .query<IOffer[]>('SELECT * FROM offers WHERE offer_code = ?', [offer_code])
    .then(([results]) => results[0]);
};

const create = async (newOffer: IOffer): Promise<number> => {
  return connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO offers (name, offer_code) VALUES (?, ?)',
      [newOffer.name, newOffer.offer_code]
    )
    .then(([results]) => results.insertId);
};

const update = async (
  idOffer: number,
  attibutesToUpdate: IOffer
): Promise<boolean> => {
  let sql = 'UPDATE offers SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (attibutesToUpdate.name) {
    sql += 'name = ? ';
    sqlValues.push(attibutesToUpdate.name);
    oneValue = true;
  }
  if (attibutesToUpdate.offer_code) {
    sql += oneValue ? ', offer_code = ? ' : ' offer_code = ? ';
    sqlValues.push(attibutesToUpdate.offer_code);
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
  getByName,
  nameIsFree,
  codeIsFree,
  create,
  update,
  destroy,
  validateOffer,
};
