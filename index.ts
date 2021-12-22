import express from 'express';
require('dotenv').config();
const app = express();
import { handleError } from './helpers/errors';
import setupRoutes from './controllers';


const port:string  = process.env.PORT || '8000';

app.use(express.json());

setupRoutes(app);

// A mettre à la fin pour gèrer les erreurs qui sortiront des routes
app.use(handleError);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
