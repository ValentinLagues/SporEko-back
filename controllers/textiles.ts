import { Request, Response } from 'express';
const textilesRouteur = require('express').Router();

textilesRouteur.get('/coucou', (req: Request, res: Response) => {
  res.status(200).send('hibou sessions');
});

///////////// SURFSTYLES BY SESSIONS///////////
textilesRouteur.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res
    .status(200)
    .send('get all for session id_session' + id);
});

module.exports = { textilesRouteur };