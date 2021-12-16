const connection = require("../db-config");
const Joi = require("joi");

const db = connection.promise();

const validate = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    name: Joi.string().max(255).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = () => {
  let sql = 'SELECT * FROM brands';
  const sqlValues: Array<any> = [];

  return db.query(sql, sqlValues).then(([results]: Array<any>) => results);
};

const findOne = (id: number) => {
  return db
    .query('SELECT * FROM brands WHERE id_brand = ?', [id])
    .then(([results]: Array<any>) => results[0])
};

const create = (newBrand: object) => {
	return db
		.query(
			"INSERT INTO brands SET ?",
			[newBrand]
		)
		.then(([result]: Array<any>) => {
			const id = result.insertId;
			return { id, ...newBrand };
		});
};

const update = (id: number, newAttributes: object) => {
  return db
    .query("UPDATE brands SET ? WHERE id_brand = ?", [newAttributes, id])
};

const destroy = (id: number) => {
  return db
    .query("DELETE FROM brands WHERE id_brand = ?", [id])
    .then(([result]: Array<any>) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  create,
  update,
  destroy,
  validate,
};
