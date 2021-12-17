const colorsRouter = require('express').Router();
import { Request, Response } from 'express';
const Color = require('../models/color');

interface ColorInfo {
  name: string;
  color_code: string;
}

colorsRouter.get('/', (req: Request, res: Response) => {
  Color.findManyColor().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

colorsRouter.get('/:idcolor', (req: Request, res: Response) => {
  const { idcolor } = req.params;
  Color.findOneColor(idcolor).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Color not found');
    }
  });
});

colorsRouter.post('/', (req: Request, res: Response) => {
  const color: ColorInfo = req.body;
  const joiErrors = Color.validateColor(color);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Color.createColor(color)
      .then(([createdColor]: Array<any>) => {
        const id = createdColor.insertId;
        res.status(201).json({ id, ...color });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

colorsRouter.put('/:idcolor', (req: Request, res: Response) => {
  const { idcolor } = req.params;
  Color.findOneColor(idcolor).then(([colorFound]: Array<any>) => {
    if (colorFound.length > 0) {
      const color: ColorInfo = req.body;
      const joiErrors = Color.validateColor(color, false);
      if (joiErrors) {
        console.log('dans if');
        res.status(409).send(joiErrors.details);
      } else {
        Color.updateColor(idcolor, color).then(() => {
          res.status(200).json({ ...colorFound[0], ...color });
        });
      }
    } else {
      res.status(404).send('Color not found');
    }
  });
});

colorsRouter.delete('/:idcolor', (req: Request, res: Response) => {
  const { idcolor } = req.params;
  Color.findOneColor(idcolor).then(([colorFound]: Array<any>) => {
    if (colorFound.length > 0) {
      Color.destroyColor(idcolor).then(() => {
        res.status(200).send('Couleur supprimée');
      });
    } else {
      res.status(404).send('Couleur non trouvée (vérif id)');
    }
  });
});

module.exports = { colorsRouter };
