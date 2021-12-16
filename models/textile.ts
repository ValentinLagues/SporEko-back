
const Joi = require("joi");
const dbTextiles = require('../db-config')



const validate = (data:object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    name: Joi.string().max(255).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = async () => {
  const sql = 'SELECT * FROM textiles';
  const result = await dbTextiles.connection.promise().query(sql);
  return result[0];
};



module.exports = {
  findMany,
  validate,
};
