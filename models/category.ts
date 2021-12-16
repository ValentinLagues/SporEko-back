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
  let sql = 'SELECT * FROM categories';
  const sqlValues: Array<any> = [];

  return db.query(sql, sqlValues).then(([results]: Array<any>) => results);
};

const findOne = (id: number) => {
  return db
    .query('SELECT * FROM categories WHERE id_category = ?', [id])
    .then(([results]: Array<any>) => results[0])
};

const create = (newCategory: object) => {
	return db
		.query(
			"INSERT INTO categories SET ?",
			[newCategory]
		)
		.then(([result]: Array<any>) => {
			const id = result.insertId;
			return { id, ...newCategory };
		});
};

const update = (id: number, newAttributes: object) => {
  return db
    .query("UPDATE categories SET ? WHERE id_category = ?", [newAttributes, id])
};

const destroy = (id: number) => {
  return db
    .query("DELETE FROM categories WHERE id_category = ?", [id])
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
