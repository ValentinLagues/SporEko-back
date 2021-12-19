const mondialRelaysRouter = require('express').Router();
import { Request, Response } from 'express';
const MondialRelay = require('../models/mondialrelay');

interface MondialRelayInfo {
  name: string;
  weight: string;
  price: number;
}

mondialRelaysRouter.get('/', (req: Request, res: Response) => {
  MondialRelay.findManyMondialRelays().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

mondialRelaysRouter.get('/:idmondialrelay', (req: Request, res: Response) => {
  const { idmondialrelay } = req.params;
  MondialRelay.findOneMondialRelay(idmondialrelay).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Mondial Relay not found');
    }
  });
});

mondialRelaysRouter.post('/', (req: Request, res: Response) => {
  const mondialrelay : MondialRelayInfo = req.body;
  const joiErrors = MondialRelay.validateMondialRelay(mondialrelay);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    MondialRelay.createMondialRelay(mondialrelay)
      .then(([createdMondialRelay]: Array<any>) => {
        const id = createdMondialRelay.insertId;
        res.status(201).json({ id, ...mondialrelay });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

mondialRelaysRouter.put('/:idmondialrelay', (req: Request, res: Response) => {
  const { idmondialrelay } = req.params;
  MondialRelay.findOneMondialRelay(idmondialrelay).then(
    ([mondialRelayFound]: Array<any>) => {
      if (mondialRelayFound.length > 0) {
        const mondialrelay : MondialRelayInfo = req.body;
        const joiErrors = MondialRelay.validateMondialRelay(mondialrelay, false);
        if (joiErrors) {
          res.status(409).send(joiErrors.details);
        } else {
          MondialRelay.updateMondialRelay(idmondialrelay, mondialrelay).then(() => {
            res.status(200).json({ ...mondialRelayFound[0], ...mondialrelay });
          });
        }
      } else {
        res.status(404).send('Mondial Relay not found');
      }
    }
  );
});

mondialRelaysRouter.delete('/:idmondialrelay', (req: Request, res: Response) => {
  const { idmondialrelay } = req.params;
  MondialRelay.findOneMondialRelay(idmondialrelay).then(
    ([mondialRelayFound]: Array<any>) => {
      if (mondialRelayFound.length > 0) {
        MondialRelay.destroyMondialRelay(idmondialrelay).then(() => {
          res.status(200).send('Mondial Relay successfully deleted');
        });
      } else {
        res.status(404).send('Mondial Relay not found');
      }
    }
  );
});

module.exports = { mondialRelaysRouter };
