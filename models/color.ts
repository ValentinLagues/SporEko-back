const JoiColor = require('joi');
const dbColor = require('../db-config');

const connectDbColor = dbColor.connection.promise();

const validateColor = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiColor.object({
    name: JoiColor.string().max(50).presence(presence),
    color_code: JoiColor.string().min(7).max(9).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyColor = () => {
  return connectDbColor.query('SELECT * FROM colors');
};

const findOneColor = (id: number) => {
  return connectDbColor.query('SELECT * FROM colors WHERE id_color = ?', [id]);
};

const createColor = (newColor: object) => {
  return connectDbColor.query('INSERT INTO colors SET ?', [newColor]);
};

const updateColor = (id: number, newAttributes: object) => {
  return connectDbColor.query('UPDATE colors SET ? WHERE id_color = ?', [
    newAttributes,
    id,
  ]);
};

const destroyColor = (id: number) => {
  return connectDbColor.query('DELETE FROM colors WHERE id_color = ?', [id]);
};

module.exports = {
  findManyColor,
  findOneColor,
  createColor,
  updateColor,
  destroyColor,
  validateColor,
};
