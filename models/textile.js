const connection = require('../db-config');
const Joi = require("joi");

const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    name: Joi.string().max(255).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = () => {
  let sql = 'SELECT * FROM textiles';
  const sqlValues = [];

  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query('SELECT * FROM textiles WHERE id_textile = ?', [id])
    .then(([results]) => results[0])
};

const create = (newUser) => {
	return db
		.query(
			"INSERT INTO textiles SET ?",
			[newUser]
		)
		.then(([result]) => {
			const id = result.insertId;
			return { id, ...newUser };
		});
};

const update = (id, newAttributes) => {
  return db
    .query("UPDATE textiles SET ? WHERE id_textile = ?", [newAttributes, id])
};

const destroy = (id) => {
  return db
    .query("DELETE FROM textiles WHERE id_textile = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  create,
  update,
  destroy,
  validate,
};
