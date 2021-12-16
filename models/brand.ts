const dbBrands= require("../db-config");
const JoiBrands = require("joi");


const validateBrand = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return JoiBrands.object({
    name: JoiBrands.string().max(50).presence(presence),
  }).validateBrand(data, { abortEarly: false }).error;
};

const findManyBrands = () => {
  let sql = "SELECT * FROM brands";
  return dbBrands.connection.promise().query(sql)
};

const findOneBrand = (id: number) => {
  return dbBrands.connection.promise()
  .query("SELECT * FROM brands WHERE id_brand = ?", [id])
};

const createBrand = (name: object) => {
	return dbBrands.connection.promise()
		.query("INSERT INTO brands SET ?",
			[name]
		)
		
};

const updateBrand = (id: number, name: object) => {
  return dbBrands.connection.promise()
    .query("UPDATE brands SET name = ? WHERE id_brand = ? ", [name, id])
};

const destroyBrand = (id: number) => {
  return dbBrands.connection.promise()
    .query("DELETE FROM brands WHERE id_brand = ?", [id])
};

module.exports = {
  validateBrand,
  findManyBrands,
  findOneBrand,
  createBrand,
  updateBrand,
  destroyBrand,
};