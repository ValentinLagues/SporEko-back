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
  Color.findColorById(idcolor).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Color not found');
    }
  });
});

colorsRouter.post('/', (req: Request, res: Response) => {
  interface JoiErrorsModel {
    details: Array<any>;
  }
  interface ErrModel {
    message: string;
    path: Array<any>;
  }

  const color: ColorInfo = req.body;
  const duplicateDataArray: Array<any> = [];
  const joiErrorsArray: Array<any> = [];
  let joiErrors: JoiErrorsModel;

  Promise.all([
    Color.findColorByName(color.name),
    Color.findColorByColorCode(color.color_code),
  ])
    .then(([colorNameAlreadytaken, colorCodeAlreadytaken]) => {
      if (colorNameAlreadytaken[0].length > 0) {
        duplicateDataArray.push({
          message: 'Ce nom existe déjà',
          field: 'name',
        });
      }
      if (colorCodeAlreadytaken[0].length > 0) {
        duplicateDataArray.push({
          message: 'Ce code couleur existe déjà',
          field: 'color_code',
        });
      }
      if (duplicateDataArray.length) {
        return Promise.reject(duplicateDataArray);
      }

      joiErrors = Color.validateColor(color);
      if (joiErrors) {
        joiErrors.details.map((err: ErrModel) => {
          joiErrorsArray.push({
            message: err.message,
            field: err.path[0],
          });
        });
        return Promise.reject(joiErrorsArray);
      }

      return Color.createColor(color);
    })
    .then(([createdColor]: Array<any>) => {
      const id = createdColor.insertId;
      res.status(201).json({ id, ...color });
    })
    .catch((err) => {
      if (err === duplicateDataArray) {
        res.status(409).json(duplicateDataArray);
      } else if (err === joiErrorsArray) {
        res.status(422).json(joiErrorsArray);
      } else res.status(500).send('erreur d interface chaise-écran');
    });
});

colorsRouter.put('/:idcolor', (req: Request, res: Response) => {
  interface JoiErrorsModel {
    details: Array<any>;
  }
  interface ErrModel {
    message: string;
    path: Array<any>;
  }

  const { idcolor } = req.params;
  const color: ColorInfo = req.body;
  let colorFound: ColorInfo;
  const duplicateDataArray: Array<any> = [];
  const joiErrorsArray: Array<any> = [];
  let joiErrors: JoiErrorsModel;

  Promise.all([
    Color.findColorById(idcolor),
    Color.findColorByName(color.name),
    Color.findColorByColorCode(color.color_code),
  ])
    .then(([[colorIDFound], colorNameAlreadytaken, colorCodeAlreadytaken]) => {
      if (colorIDFound.length === 0) {
        return Promise.reject('Not found');
      }
      colorFound = colorIDFound[0];

      if (colorNameAlreadytaken[0].length > 0) {
        duplicateDataArray.push({
          message: 'Ce nom existe déjà',
          field: 'name',
        });
      }
      if (colorCodeAlreadytaken[0].length > 0) {
        duplicateDataArray.push({
          message: 'Ce code couleur existe déjà',
          field: 'color_code',
        });
      }
      if (duplicateDataArray.length) {
        return Promise.reject(duplicateDataArray);
      }

      joiErrors = Color.validateColor(color, false);
      if (joiErrors) {
        joiErrors.details.map((err: ErrModel) => {
          joiErrorsArray.push({
            message: err.message,
            field: err.path[0],
          });
        });
        return Promise.reject(joiErrorsArray);
      }

      return Color.updateColor(idcolor, color);
    })
    .then(() => {
      res.status(200).json({ ...colorFound, ...color });
    })
    .catch((err) => {
      if (err === 'Not found') {
        res.status(404).send('Couleur non trouvée');
      } else if (err === duplicateDataArray) {
        res.status(409).json(duplicateDataArray);
      } else if (err === joiErrorsArray) {
        res.status(422).json(joiErrorsArray);
      } else res.status(500).send('erreur d interface chaise-écran');
    });
});

colorsRouter.delete('/:idcolor', (req: Request, res: Response) => {
  const { idcolor } = req.params;
  Color.findColorById(idcolor).then(([colorFound]: Array<any>) => {
    if (colorFound.length > 0) {
      Color.destroyColor(idcolor).then(() => {
        res.status(200).send(`Couleur id:${idcolor} supprimé`);
      });
    } else {
      res.status(404).send(`Couleur id:${idcolor} supprimé`);
    }
  });
});

module.exports = { colorsRouter };
