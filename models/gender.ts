const dbGenders= require("../db-config");
const joiGenders = require("joi");



const validateGender = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joiGenders.object({
    name: joiGenders.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyGenders = () => {
  const sql = 'SELECT * FROM genders';
  return dbGenders.connection.promise().query(sql)
};

const findByGenderName = (name: string)=>{
  return dbGenders.connection.promise().query('SELECT * FROM genders WHERE name = ? ', [name])
  
} 

const findOneGender = (id: number) => {
  return dbGenders.connection.promise().query('SELECT * FROM genders WHERE id_gender = ? ', [id])
    
};

const createGender = (name:object) => {
  return dbGenders.connection.promise()
    .query("INSERT INTO genders SET ? ",
      [name]
		)
	};

const updateGender = (id: number, name: object) => {
  return dbGenders.connection.promise()
    .query("UPDATE genders SET ? WHERE id_gender = ? ", [name, id])
};

const destroyGender = (id: number) => {
  return dbGenders.connection.promise()
    .query("DELETE FROM genders WHERE id_gender = ?", [id])
};

module.exports = {
  findManyGenders,
  findByGenderName,
  findOneGender,
  createGender,
  updateGender,
  destroyGender,
  validateGender,
};