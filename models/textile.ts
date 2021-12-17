const JoiTextile = require('joi');
const dbTextile = require('../db-config');

const connectDbTextile = dbTextile.connection.promise();

const validateTextile = (data: object, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return JoiTextile.object({
      name: JoiTextile.string().max(80).presence(presence),
    }).validate(data, { abortEarly: false }).error;
  };

  const findManyTextile = () => {
    return connectDbTextile.query('SELECT * FROM textiles');
  };
  
  const findOneTextile = (id: number) => {
    return connectDbTextile.query('SELECT * FROM textiles WHERE id_textile = ?', [id]);
  };

  const createTextile = (newTextile: object) => {
    return connectDbTextile.query('INSERT INTO textiles SET ?', [newTextile]);
  };
  
  const updateTextile = (id: number, newAttributes: object) => {
    return connectDbTextile.query('UPDATE textiles SET ? WHERE id_textile = ?', [
      newAttributes,
      id,
    ]);
  };

  const destroyTextile = (id: number) => {
    return connectDbTextile
      .query('DELETE FROM textiles WHERE id_textile = ?', [id]);
    //   .then(([result]: Array<any>) => result.affectedRows !== 0);
  };

  module.exports = {
    findManyTextile,
    findOneTextile,
    createTextile,
    updateTextile,
    destroyTextile,
    validateTextile,
  };

