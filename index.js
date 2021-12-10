const cors = require('cors');
const express = require('express');
const connection = require('./db-config');

const app = express();
// utilise le package cors pour autoriser les appels extérieurs
app.use(
  cors({
    origin: '*',
  })
);

const port = process.env.PORT || 8000;

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
  } else {
    console.log(
      `connected to database with threadId :  ${connection.threadId}`
    );
  }
});

app.get('/', (req, res) => {
  const sqlQuery = 'SELECT * FROM brands';
  connection.query(sqlQuery, (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}, 
  http://localhost:${port}/`);
});
