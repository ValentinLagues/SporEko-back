const JoiSportifStyle = require('joi');
const dbSportifStyle = require('../db-config');

const connectDbSportifStyle = dbSportifStyle.connection.promise();

const validateSportifStyle = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiSportifStyle.object({
    name: JoiSportifStyle.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManySportifStyles = () => {
  return connectDbSportifStyle.query('SELECT * FROM sportif_style');
};

const findOneSportifStyle = (id: number) => {
  return connectDbSportifStyle.query('SELECT * FROM sportif_style WHERE id_sportif_style = ?', [id]);
};

const findBySportifStyleName = (name: string) => {
  return connectDbSportifStyle.query('SELECT * FROM sportif_style WHERE name = ?', [name]);
}

const createSportifStyle = (newSportifStyle: object) => {
  return connectDbSportifStyle.query('INSERT INTO sportif_style SET ?', [newSportifStyle]);
};

const updateSportifStyle = (id: number, newAttributes: object) => {
  return connectDbSportifStyle.query('UPDATE sportif_style SET ? WHERE id_sportif_style = ?', [
    newAttributes,
    id,
  ]);
};

const destroySportifStyle = (id: number) => {
  return connectDbSportifStyle.query('DELETE FROM sportif_style WHERE id_sportif_style = ?', [id]);
};

module.exports = {
  validateSportifStyle,
  findManySportifStyles,
  findOneSportifStyle,
  findBySportifStyleName,
  createSportifStyle,
  updateSportifStyle,
  destroySportifStyle,
};