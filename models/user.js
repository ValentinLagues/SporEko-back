const connection = require('../db-config');

const db = connection.promise();

const findMany = () => {
  let sql = 'SELECT * FROM users';
  const sqlValues = [];

  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query('SELECT * FROM users WHERE id_user = ?', [id])
    .then(([results]) => results[0])
};

const create = (newUser) => {
  // faudra déstructurer, ne pas retourner le mdp etc
	return db
		.query(
			"INSERT INTO users SET ?",
			[newUser]
		)
		.then(([result]) => {
			const id = result.insertId;
			return { id, ...newUser };
		});
};

const update = (id, newAttributes) => {
  console.log(id, newAttributes)
  return db
    .query("UPDATE users SET ? WHERE id_user = ?", [newAttributes, id])
};

const destroy = (id) => {
  return db
    .query("DELETE FROM users WHERE id_user = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  create,
  update,
  destroy,
};
