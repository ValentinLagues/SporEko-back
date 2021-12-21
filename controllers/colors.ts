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
  const color: ColorInfo = req.body;
  let duplicateData: string = '';
  interface joiErrorsModel {
    details: Array<any>;
  }
  interface errModel {
    message: string;
  }
  let joiErrors: joiErrorsModel;

  Promise.all([
    Color.findColorByName(color.name),
    Color.findColorByColorCode(color.color_code),
  ])
    .then(([emailAlreadytaken, pseudoAlreadytaken]) => {
      if (emailAlreadytaken[0].length > 0) {
        duplicateData += 'Ce nom existe déjà; ';
      }
      if (pseudoAlreadytaken[0].length > 0) {
        duplicateData += 'Ce code couleur existe déjà; ';
      }
      if (duplicateData) {
        return Promise.reject(duplicateData);
      }

      joiErrors = Color.validateColor(color);
      if (joiErrors) {
        return Promise.reject('INVALID_DATA');
      }

      return Color.createColor(color);
    })
    .then(([createdColor]: Array<any>) => {
      const id = createdColor.insertId;
      res.status(201).json({ id, ...color });
    })
    .catch((err) => {
      if (err === duplicateData)
        res.status(409).json({ message: duplicateData });
      else if (err === 'INVALID_DATA') {
        const joiDetails: Array<string> = joiErrors.details.map(
          (err: errModel) => {
            return err.message;
          }
        );
        res.status(422).json(joiDetails);
      } else res.status(500).send(err);
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
  let duplicateDataArray: Array<any> = [];
  let joiErrorsArray: Array<any> = [];
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
        res.status(200).send('Couleur supprimée');
      });
    } else {
      res.status(404).send('Couleur non trouvée (vérif id)');
    }
  });
});

module.exports = { colorsRouter };
