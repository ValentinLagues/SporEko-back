const Joi = require("joi");
const dbConfig = require('../db-config')
const db = dbConfig.connection;


const validate = (data:object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    name: Joi.string().max(255).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = async () => {
  const sql = 'SELECT * FROM textiles';
  const resultat = await db.promise().query(sql);
  return resultat[0];
};



module.exports = {
  findMany,
};
