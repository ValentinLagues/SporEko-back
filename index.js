const cors = require('cors');
const express = require('express');
const connection = require('./db-config');
const { setupRoutes } = require("./routes");

const app = express();
// utilise le package cors pour autoriser les appels extérieurs
app.use(
  cors({
    origin: '*',
  })
);

const port = process.env.PORT || 8000;

app.use(express.json());
setupRoutes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}, 
  http://localhost:${port}/`);
});
