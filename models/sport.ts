const JoiSport = require('joi');
const dbSport = require('../db-config');

const connectDbSport = dbSport.connection.promise();

const validateSport = (data: object, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return JoiSport.object({
      name: JoiSport.string().max(50).presence(presence),
    }).validate(data, { abortEarly: false }).error;
  };

  const findManySport = () => {
    return connectDbSport.query('SELECT * FROM sports');
  };
  
  const findOneSport = (id: number) => {
    return connectDbSport.query('SELECT * FROM sports WHERE id_sport = ?', [id]);
  };

  const createSport = (newSport: object) => {
    return connectDbSport.query('INSERT INTO sports SET ?', [newSport]);
  };
  
  const updateSport = (id: number, newAttributes: object) => {
    return connectDbSport.query('UPDATE sports SET ? WHERE id_sport = ?', [
      newAttributes,
      id,
    ]);
  };

  const destroySport = (id: number) => {
    return connectDbSport
      .query('DELETE FROM sports WHERE id_sport = ?', [id]);
    //   .then(([result]: Array<any>) => result.affectedRows !== 0);
  };

  module.exports = {
    findManySport,
    findOneSport,
    createSport,
    updateSport,
    destroySport,
    validateSport,
  };

