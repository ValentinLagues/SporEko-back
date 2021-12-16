require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

<<<<<<< HEAD
module.exports = {connection};
=======
module.exports = { connection };
>>>>>>> 548c015cbf5b9b6f09f12a01ff8191296692a489
