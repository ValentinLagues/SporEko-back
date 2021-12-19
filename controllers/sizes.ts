import { Request, Response } from 'express';
const sizesRouter = require('express').Router();
const Sizes = require('../models/size')

interface SizeInfo {
  name: string;
  is_children: number;
}

sizesRouter.get('/', (req: Request, res: Response) => {
  Sizes.findManySizes().then(([result]: Array<any>) => {
    res.status(200).json(result);
  }).catch((err: Error) => {
    console.log(err)
    res.status(500).send('Erreur impossible de trouvé genders dans la base de donnée');
  });
});

sizesRouter.get('/:id', (req: Request, res: Response) => {

  const { id } = req.params;
  Sizes.findOneSize(id).
    then(([result]: Array<any>) => {
      if (result[0]) res.status(200).json(result[0]);
      else res.status(404).json(`Size id:${id} n'existe pas dans la base de données`)
    }).catch((err: Error) => {
      console.log(err)
      res.status(500).send('Erreur impossible de trouvé size dans la base de donnée');
    });
});

sizesRouter.post('/', (req: Request, res: Response) => {
  const size: SizeInfo = req.body;
  const joiErrors = Sizes.validateSize(size);
  
      Sizes.createSize(size)
        .then(([createdSize]: Array<any>) => {
          const id = createdSize.insertId;
          res.status(201).json({ id, ...size });
        })
        .catch((error: Array<any>) => {
          res.status(500).send(error);
          res.status(422).send(joiErrors.details);
        });
});

sizesRouter.put('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  const size: SizeInfo = req.body;
  const joiErrors = Sizes.validateSize(size);
  if (joiErrors) res.status(422).json(joiErrors.message);
  else Sizes.updateSize(id, size ).then(() =>  res.status(201).json({ id_size: id, ...size }))
  .catch((error: Array<any>) => {
    res.status(500).send(error);
  });

});

sizesRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Sizes.destroySize(id).then((result: Array<any>) => {
    if (result[0].affectedRows) res.status(201).json(`Size id:${id} supprimé`)
    else res.status(404).json(`Size id:${id} n'existe pas`)
  })
});

module.exports = { sizesRouter };