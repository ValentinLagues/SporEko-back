const dbGenders= require("../db-config");
const JoiGenders = require("joi");



const validateGender = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return JoiGenders.object({
    name: JoiGenders.string().max(50).presence(presence),
  }).validateGender(data, { abortEarly: false }).error;
};

const findManyGenders = () => {
  let sql = 'SELECT * FROM genders';
  return dbGenders.connection.promise().query(sql)
};

const findOneGender = (id: number) => {
  return dbGenders.connection.promise().query('SELECT * FROM genders WHERE id_gender = ? ', [id])
    
};

const createGender = (name: object) => {
	return dbGenders.connection.promise()
		.query("INSERT INTO genders (name) VALUES (?) ",
			[name]
		)
		
};

const updateGender = (id: number, name: object) => {
  return dbGenders.connection.promise()
    .query("UPDATE genders SET name = ? WHERE id_gender = ? ", [name, id])
};

const destroyGender = (id: number) => {
  return dbGenders.connection.promise()
    .query("DELETE FROM genders WHERE id_gender = ?", [id])
};

module.exports = {
  findManyGenders,
  findOneGender,
  createGender,
  updateGender,
  destroyGender,
  validateGender,
};