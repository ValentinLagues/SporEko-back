const express = require('express');
const { setupRoutes } = require('./routes');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8000;

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
