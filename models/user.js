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
    .then(([results]) => results[0]);
};

module.exports = {
  findMany,
  findOne,
};
