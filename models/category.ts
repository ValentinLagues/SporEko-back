const dbCategories= require("../db-config");
const JoiCategories = require("joi");


const validateCategory = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return JoiCategories.object({
    name: JoiCategories.string().max(50).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyCategories = () => {
  let sql = "SELECT * FROM categories";
  return dbCategories.connection.promise().query(sql)
};

const findOneCategory = (id: number) => {
  return dbCategories.connection.promise()
  .query("SELECT * FROM categories WHERE id_category = ?", [id])
};

const createCategory = (name: object) => {
	return dbCategories.connection.promise()
		.query("INSERT INTO categories SET ?",
			[name]
		)
		
};

const updateCategory = (id: number, name: object) => {
  return dbCategories.connection.promise()
    .query("UPDATE categories SET name = ? WHERE id_category = ?", [name, id])
};

const destroyCategory = (id: number) => {
  return dbCategories.connection.promise()
    .query("DELETE FROM categories WHERE id_category = ?", [id])
};

module.exports = {
  validateCategory,
  findManyCategories,
  findOneCategory,
  createCategory,
  updateCategory,
  destroyCategory,
};