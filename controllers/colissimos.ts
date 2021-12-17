const colissimosRouter = require('express').Router();
import { Request, Response } from 'express';
const Colissimo = require('../models/colissimo');

interface ColissimoInfo {
  name: string;
  weight: string;
  price: number;
}

colissimosRouter.get('/', (req: Request, res: Response) => {
  Colissimo.findManyColissimo().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

colissimosRouter.get('/:idcolissimo', (req: Request, res: Response) => {
  const { idcolissimo } = req.params;
  Colissimo.findOneColissimo(idcolissimo).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Colissimo non trouvé');
    }
  });
});

colissimosRouter.post('/', (req: Request, res: Response) => {
  const colissimo: ColissimoInfo = req.body;
  const joiErrors = Colissimo.validateColissimo(colissimo);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Colissimo.createColissimo(colissimo)
      .then(([createdColissimo]: Array<any>) => {
        const id = createdColissimo.insertId;
        res.status(201).json({ id, ...colissimo });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

colissimosRouter.put('/:idcolissimo', (req: Request, res: Response) => {
  const { idcolissimo } = req.params;
  Colissimo.findOneColissimo(idcolissimo).then(
    ([colissimoFound]: Array<any>) => {
      if (colissimoFound.length > 0) {
        const colissimo: ColissimoInfo = req.body;
        const joiErrors = Colissimo.validateColissimo(colissimo, false);
        if (joiErrors) {
          res.status(409).send(joiErrors.details);
        } else {
          Colissimo.updateColissimo(idcolissimo, colissimo).then(() => {
            res.status(200).json({ ...colissimoFound[0], ...colissimo });
          });
        }
      } else {
        res.status(404).send('Colissimo non trouvé');
      }
    }
  );
});

colissimosRouter.delete('/:idcolissimo', (req: Request, res: Response) => {
  const { idcolissimo } = req.params;
  Colissimo.findOneColissimo(idcolissimo).then(
    ([colissimoFound]: Array<any>) => {
      if (colissimoFound.length > 0) {
        Colissimo.destroyColissimo(idcolissimo).then(() => {
          res.status(200).send('Colissimo supprimé');
        });
      } else {
        res.status(404).send('Colissimo non trouvé (vérif id)');
      }
    }
  );
});

module.exports = { colissimosRouter };
