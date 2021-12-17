const JoiColissimo = require('joi');
const dbColissimo = require('../db-config');

// `id_colissimo` INT NOT NULL AUTO_INCREMENT,
// `name` varchar(150) DEFAULT NULL,
// `weight` varchar(100) NOT NULL,
// `price` float NOT NULL,

const connectDbColissimo = dbColissimo.connection.promise();

const validateColissimo = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiColissimo.object({
    name: JoiColissimo.string().max(150).presence(presence),
    weight: JoiColissimo.string().max(100).presence(presence),
    price: JoiColissimo.number()
      .positive()
      .precision(2)
      .strict()
      .presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyColissimo = () => {
  return connectDbColissimo.query('SELECT * FROM colissimo');
};

const findOneColissimo = (id: number) => {
  return connectDbColissimo.query(
    'SELECT * FROM colissimo WHERE id_colissimo = ?',
    [id]
  );
};

const createColissimo = (newColissimo: object) => {
  return connectDbColissimo.query('INSERT INTO colissimo SET ?', [
    newColissimo,
  ]);
};

const updateColissimo = (id: number, newAttributes: object) => {
  return connectDbColissimo.query(
    'UPDATE colissimo SET ? WHERE id_colissimo = ?',
    [newAttributes, id]
  );
};

const destroyColissimo = (id: number) => {
  return connectDbColissimo.query(
    'DELETE FROM colissimo WHERE id_colissimo = ?',
    [id]
  );
};

module.exports = {
  findManyColissimo,
  findOneColissimo,
  createColissimo,
  updateColissimo,
  destroyColissimo,
  validateColissimo,
};
