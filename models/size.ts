const dbSizes= require("../db-config");
const JoiSizes = require("joi");



const validateSize = (data: object, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return JoiSizes.object({
    name: JoiSizes.string().max(45).presence(presence),
    is_children: JoiSizes.number().integer().min(0).max(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManySizes = () => {
  let sql = 'SELECT * FROM sizes';
  return dbSizes.connection.promise().query(sql)
};

const findOneSize = (id: number) => {
  return dbSizes.connection.promise().query('SELECT * FROM sizes WHERE id_size = ? ', [id])
    
};

const createSize = (name: object,isChildren:boolean) => {
	return dbSizes.connection.promise()
		.query("INSERT INTO sizes  SET ? ",
			[name,isChildren]
		)
		
};

const updateSize = (id: number, newAttributes:object) => {
  return dbSizes.connection.promise()
    .query(" UPDATE sizes  SET  ?  WHERE id_size = ? ", [newAttributes,id])
};

const destroySize = (id: number) => {
  return dbSizes.connection.promise()
    .query("DELETE FROM sizes WHERE id_size = ? ", [id])
};

module.exports = {
  findManySizes,
  findOneSize,
  createSize,
  updateSize,
  destroySize,
  validateSize,
};
