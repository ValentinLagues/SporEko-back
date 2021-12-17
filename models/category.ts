const JoiCategories = require('joi');
const dbCategories = require('../db-config');

const connectDbCategories = dbCategories.connection.promise();

const validateCategory = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiCategories.object({
    name: JoiCategories.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyCategories = () => {
  return connectDbCategories.query('SELECT * FROM categories');
};

const findOneCategory = (id: number) => {
  return connectDbCategories.query('SELECT * FROM categories WHERE id_category = ?', [id]);
};

const findByCategoryName = (name: string) => {
  return connectDbCategories.query('SELECT * FROM categories WHERE name = ?', [name]);
}

const createCategory = (newCategory: object) => {
  return connectDbCategories.query('INSERT INTO categories SET ?', [newCategory]);
};

const updateCategory = (id: number, newAttributes: object) => {
  return connectDbCategories.query('UPDATE categories SET ? WHERE id_category = ?', [
    newAttributes,
    id,
  ]);
};

const destroyCategory = (id: number) => {
  return connectDbCategories.query('DELETE FROM categories WHERE id_category = ?', [id]);
};

module.exports = {
  validateCategory,
  findManyCategories,
  findOneCategory,
  findByCategoryName,
  createCategory,
  updateCategory,
  destroyCategory,
};