// sert à configurer les variables d'environnement (je suis pas sure du nom)
// dotenv doit surement servir à relier db-config à .env
require('dotenv').config();

// on doit faire appel à mysql2 pour communiquer avec notre bdd
const mysql = require('mysql2');


// c'est là qu'on configure la connection à la bdd et qu'on lui dit d'aller chercher les infos dans .env
// pour l'instant on est en local donc :
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // localhost
  port: process.env.DB_PORT, // 3306 c'est le port pour mysql en local
  user: process.env.DB_USER, // vous avez surement mis root, pas moi XD
  password: process.env.DB_PASSWORD, // vous avez surement mis root, pas moi XD
  database: process.env.DB_NAME, // le nom de la bdd que vous avez crée en local. moi j'ai mis le même nom que celle du client
});

// c'est dans chaque fichier models qu'on appellera connection avec const db = connection.promise();

module.exports = connection;
