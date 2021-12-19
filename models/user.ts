const JoiUser = require('joi');
const dbUser = require('../db-config');

const connectDbUser = dbUser.connection.promise();

const validateUser = (data: object, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return JoiUser.object({
    lastname: JoiUser.string().max(255).presence(presence),
    firstname: JoiUser.string().max(255).presence(presence),
    adress: JoiUser.string().max(255).presence(presence),
    zipcode: JoiUser.number().integer().max(99999).presence(presence),
    city: JoiUser.string().max(255).presence(presence),
    mail: JoiUser.string().max(255).presence(presence),
    hash_password: JoiUser.string().max(255).presence(presence),
    picture: JoiUser.string().max(255),
    isadmin: JoiUser.number().integer().min(0).max(1).presence(presence),
    isarchived: JoiUser.number().integer().min(0).max(1).presence(presence),
    id_gender: JoiUser.number().integer().min(1).presence(presence),
    adress_complement: JoiUser.string().max(255),
    id_sportif_style: JoiUser.number().integer().min(1),
    birthday: JoiUser.string().max(50).presence(presence), //c'est date... = string?
    phone: JoiUser.string().max(14).presence(presence),
    pseudo: JoiUser.string().max(25).presence(presence),
    authentified_by_facebook: JoiUser.number()
      .integer()
      .min(0)
      .max(1)
      .presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findManyUser = () => {
  return connectDbUser.query('SELECT * FROM users');
};

const findUserById = (id: number) => {
  return connectDbUser.query('SELECT * FROM users WHERE id_user = ?', [id]);
};

const findUserByEmail = (email: string) => {
  return connectDbUser.query('SELECT * FROM users WHERE mail = ?', [email]);
};

const findUserByPseudo = (pseudo: number) => {
  return connectDbUser.query('SELECT * FROM users WHERE pseudo = ?', [pseudo]);
};

const createUser = (newUser: object) => {
  return connectDbUser.query('INSERT INTO users SET ?', [newUser]);
};

const updateUser = (id: number, newAttributes: object) => {
  return connectDbUser.query('UPDATE users SET ? WHERE id_user = ?', [
    newAttributes,
    id,
  ]);
};

const destroyUser = (id: number) => {
  return connectDbUser.query('DELETE FROM users WHERE id_user = ?', [id]);
};

module.exports = {
  findManyUser,
  findUserById,
  findUserByEmail,
  findUserByPseudo,
  createUser,
  updateUser,
  destroyUser,
  validateUser,
};
