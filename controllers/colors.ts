const colorsRouter = require('express').Router();
import { Request, Response } from 'express';
const Color = require('../models/color');

interface ColorInfo {
  name: string;
  color_code: string;
}

///////////// COLORS ///////////////

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
      .then((createdColor: object) => {
        console.log(createdColor);
        res.status(201).json(createdColor);
      })
      .catch((error: Array<any>) => {
        console.log(error);
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
        Color.updateColor(idcolor, color).then((updatedColor: object) => {
          // console.log(updatedColor);
          // console.log({ ...colorFound, ...color });
          res.status(200).json({ ...colorFound, ...color });
          // const id_color = updatedColor[0].insertId
          // res.status(201).json(updatedColor)
        });
      }
    } else {
      res.status(404).send('Color not found');
    }
  });
});

// colorsRouter.delete('/:idcolor', (req: Request, res: Response) => {
//   const { idcolor } = req.params;
//   res.status(200).send('delete color for id_color ' + idcolor);
// });

///////////// OFFERS BY color //////////////

// colorsRouter.get('/:idbrand/offers', (req: Request, res: Response) => {
//   const { idcolor } = req.params;
//   res.status(200).send(`SELECT *
// FROM categories AS c
// INNER JOIN offers AS o
// ON c.id_color = o.id_color
// AND o.id_color = ${idcolor}`);
// });

module.exports = { colorsRouter };
