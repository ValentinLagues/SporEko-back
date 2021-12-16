import { Request, Response } from 'express';
const textilesRouter = require('express').Router();
const Textiles = require('../models/textile')

textilesRouter.get('/', (req: Request, res: Response) => {
  Textiles.findMany().then(([result]:Array<any>) => {
    console.log(result)
    res.status(200).send(result);
  });
   
  
});

///////////// SURFSTYLES BY SESSIONS///////////
textilesRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
    res
    .status(200)
    .send('get all for session id_session' + id);

  
});

module.exports = { textilesRouter };