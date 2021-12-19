const JoiMondialRelay = require('joi');
const dbMondialRelay = require('../db-config');

const connectDbMondialRelay = dbMondialRelay.connection.promise();

const validateMondialRelay = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiMondialRelay.object({
    name: JoiMondialRelay.string().max(150).presence(presence),
    weight: JoiMondialRelay.string().max(100).presence(presence),
    price: JoiMondialRelay.number()
      .positive()
      .precision(2)
      .strict()
      .presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyMondialRelays = () => {
  return connectDbMondialRelay.query('SELECT * FROM mondial_relay');
};

const findOneMondialRelay = (id: number) => {
  return connectDbMondialRelay.query(
    'SELECT * FROM mondial_relay WHERE id_mondial_relay = ?',
    [id]
  );
};

const findByMondialRelayName = (name: string) => {
    return connectDbMondialRelay.query('SELECT * FROM mondial_relay WHERE name = ?', [name]);
  }

const createMondialRelay = (newMondialRelay: object) => {
  return connectDbMondialRelay.query('INSERT INTO mondial_relay SET ?', [
    newMondialRelay,
  ]);
};

const updateMondialRelay = (id: number, newAttributes: object) => {
  return connectDbMondialRelay.query(
    'UPDATE mondial_relay SET ? WHERE id_mondial_relay = ?',
    [newAttributes, id]
  );
};

const destroyMondialRelay = (id: number) => {
  return connectDbMondialRelay.query(
    'DELETE FROM mondial_relay WHERE id_mondial_relay = ?',
    [id]
  );
};

module.exports = {
  validateMondialRelay,
  findManyMondialRelays,
  findOneMondialRelay,
  findByMondialRelayName,
  createMondialRelay,
  updateMondialRelay,
  destroyMondialRelay,
};
