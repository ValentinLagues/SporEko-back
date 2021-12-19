const sportifStylesRouter = require('express').Router();
import { Request, Response } from 'express';
const SportifStyle = require('../models/condition');

interface SportifStyleInfo {
  name: string;
}

sportifStylesRouter.get('/', (req: Request, res: Response) => {
  SportifStyle.findManySportifStyles().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

sportifStylesRouter.get('/:idsportifstyle', (req: Request, res: Response) => {
  const { idsportifstyle } = req.params;
  SportifStyle.findOneSportifStyle(idsportifstyle).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Sportif style not found');
    }
  });
});

sportifStylesRouter.post('/', (req: Request, res: Response) => {
  const sportifstyle: SportifStyleInfo = req.body;
  const joiErrors = SportifStyle.validateSportifStyle(sportifstyle);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    SportifStyle.createSportifStyle(sportifstyle)
      .then(([createdSportifStyle]: Array<any>) => {
        const id = createdSportifStyle.insertId;
        res.status(201).json({ id, ...sportifstyle });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

sportifStylesRouter.put('/:idsportifstyle', (req: Request, res: Response) => {
  const { idsportifstyle } = req.params;
  SportifStyle.findOneSportifStyle(idsportifstyle).then(([sportifStyleFound]: Array<any>) => {
    if (sportifStyleFound.length > 0) {
      const sportifstyle: SportifStyleInfo = req.body;
      const joiErrors = SportifStyle.validateSportifStyle(sportifstyle, false);
      if (joiErrors) {
        console.log('JoiErrors dans put sportifstyle');
        res.status(409).send(joiErrors.details);
      } else {
        SportifStyle.updateSportifStyle(idsportifstyle, sportifstyle).then(() => {
          res.status(200).json({ ...sportifStyleFound[0], ...sportifstyle });
        });
      }
    } else {
      res.status(404).send('Sportif style not found');
    }
  });
});

sportifStylesRouter.delete('/:idsportifstyle', (req: Request, res: Response) => {
  const { idsportifstyle } = req.params;
  SportifStyle.findOneSportifStyle(idsportifstyle).then(([sportifStyleFound]: Array<any>) => {
    if (sportifStyleFound.length > 0) {
      SportifStyle.destroySportifStyle(idsportifstyle).then(() => {
        res.status(200).send('Sportif style successfully deleted');
      });
    } else {
      res.status(404).send('Sportif style not found');
    }
  });
});

module.exports = { sportifStylesRouter };