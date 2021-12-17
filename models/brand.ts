const JoiBrands = require('joi');
const dbBrands = require('../db-config');

const connectDbBrands = dbBrands.connection.promise();

const validateBrand = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiBrands.object({
    name: JoiBrands.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyBrands = () => {
  return connectDbBrands.query('SELECT * FROM brands');
};

const findOneBrand = (id: number) => {
  return connectDbBrands.query('SELECT * FROM brands WHERE id_brand = ?', [id]);
};

const findByBrandName = (name: string) => {
  return connectDbBrands.query('SELECT * FROM brands WHERE name = ?', [name]);
}

const createBrand = (newBrand: object) => {
  return connectDbBrands.query('INSERT INTO brands SET ?', [newBrand]);
};

const updateBrand = (id: number, newAttributes: object) => {
  return connectDbBrands.query('UPDATE brands SET ? WHERE id_brand = ?', [
    newAttributes,
    id,
  ]);
};

const destroyBrand = (id: number) => {
  return connectDbBrands.query('DELETE FROM brands WHERE id_brand = ?', [id]);
};

module.exports = {
  validateBrand,
  findManyBrands,
  findOneBrand,
  findByBrandName,
  createBrand,
  updateBrand,
  destroyBrand,
};