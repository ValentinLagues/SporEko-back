const textilesRouter = require('express').Router();
import { Request, Response } from 'express';
const Textile = require('../models/textile');

interface TextileInfo {
  name: string;
}

///////////// TEXTILES ///////////////

textilesRouter.get('/', (req: Request, res: Response) => {
  Textile.findManyTextile().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

textilesRouter.get('/:idtextile', (req: Request, res: Response) => {
  const { idtextile } = req.params;
  Textile.findOneTextile(idtextile).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Textile non trouvé');
    }
  });
});

textilesRouter.post('/', (req: Request, res: Response) => {
  const textile: TextileInfo = req.body;
  const joiErrors = Textile.validateTextile(textile);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Textile.createTextile(textile)
      .then(([createdTextile]: Array<any>) => {
        const id = createdTextile.insertId;
        res.status(201).json({ id, ...textile });
        // console.log(createdTextile);
        // res.status(201).json(createdTextile);
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
        // console.log(error);
      });
  }
});

textilesRouter.put('/:idtextile', (req: Request, res: Response) => {
  const { idtextile } = req.params;
  Textile.findOneTextile(idtextile).then(([textileFound]: Array<any>) => {
    if (textileFound.length > 0) {
      const textile: TextileInfo = req.body;
      const joiErrors = Textile.validateTextile(textile, false);
      if (joiErrors) {
        console.log('dans if');
        res.status(409).send(joiErrors.details);
      } else {
        Textile.updateTextile(idtextile, textile).then(() => {
          // console.log(updatedTextile);
          // console.log({ ...textileFound, ...textile });
          res.status(200).json({ ...textileFound[0], ...textile });
          // const id_textile = updatedTextile[0].insertId
          // res.status(201).json(updatedTextile)
        });
      }
    } else {
      res.status(404).send('Textile non trouvé');
    }
  });
});

textilesRouter.delete('/:idtextile', (req: Request, res: Response)=>{
    const { idtextile } = req.params;
    Textile.findOneTextile(idtextile).then(([textileFound]: Array<any>)=>{
        if (textileFound.length > 0) {
          Textile.destroyTextile(idtextile).then(()=>{
              res.status(404).send('Textile supprimé');
          });
        } else {
            res.status(404).send('Textile non trouvé (vérif id)');
        }
    });
});

module.exports = { textilesRouter };