const JoiConditions = require('joi');
const dbConditions = require('../db-config');

const connectDbConditions = dbConditions.connection.promise();

const validateCondition = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiConditions.object({
    name: JoiConditions.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyConditions = () => {
  return connectDbConditions.query('SELECT * FROM conditions');
};

const findOneCondition = (id: number) => {
  return connectDbConditions.query('SELECT * FROM conditions WHERE id_condition = ?', [id]);
};

const findByConditionName = (name: string) => {
  return connectDbConditions.query('SELECT * FROM conditions WHERE name = ?', [name]);
}

const createCondition = (newCondition: object) => {
  return connectDbConditions.query('INSERT INTO conditions SET ?', [newCondition]);
};

const updateCondition = (id: number, newAttributes: object) => {
  return connectDbConditions.query('UPDATE conditions SET ? WHERE id_condition = ?', [
    newAttributes,
    id,
  ]);
};

const destroyCondition = (id: number) => {
  return connectDbConditions.query('DELETE FROM conditions WHERE id_condition = ?', [id]);
};

module.exports = {
  validateCondition,
  findManyConditions,
  findOneCondition,
  findByConditionName,
  createCondition,
  updateCondition,
  destroyCondition,
};