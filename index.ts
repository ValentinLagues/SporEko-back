import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { handleError } from './helpers/errors';
import setupRoutes from './controllers';
import path from 'path';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8000;

const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGINS,
  credentials: true,
  maxAge: 3600,
};

app.use(cors(corsOptions));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cookieParser());

setupRoutes(app);

// A mettre à la fin pour gèrer les erreurs qui sortiront des routes

app.use(handleError);

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
