const conditionsRouter = require('express').Router();
import { Request, Response } from 'express';
const Conditions = require('../models/condition');

interface ConditionInfo {
  name: string;
}

conditionsRouter.get('/', (req: Request, res: Response) => {
  Conditions.findManyConditions().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

conditionsRouter.get('/:idcondition', (req: Request, res: Response) => {
  const { idcondition } = req.params;
  Conditions.findOneCondition(idcondition).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Condition not found');
    }
  });
});

conditionsRouter.post('/', (req: Request, res: Response) => {
  const condition: ConditionInfo = req.body;
  const joiErrors = Conditions.validateCondition(condition);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Conditions.createCondition(condition)
      .then(([createdCondition]: Array<any>) => {
        const id = createdCondition.insertId;
        res.status(201).json({ id, ...condition });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

conditionsRouter.put('/:idcondition', (req: Request, res: Response) => {
  const { idcondition } = req.params;
  Conditions.findOneCondition(idcondition).then(([conditionFound]: Array<any>) => {
    if (conditionFound.length > 0) {
      const condition: ConditionInfo = req.body;
      const joiErrors = Conditions.validateCondition(condition, false);
      if (joiErrors) {
        console.log('JoiErrors dans put condition');
        res.status(409).send(joiErrors.details);
      } else {
        Conditions.updateCondition(idcondition, condition).then(() => {
          res.status(200).json({ ...conditionFound[0], ...condition });
        });
      }
    } else {
      res.status(404).send('Condition not found');
    }
  });
});

conditionsRouter.delete('/:idcondition', (req: Request, res: Response) => {
  const { idcondition } = req.params;
  Conditions.findOneCondition(idcondition).then(([conditionFound]: Array<any>) => {
    if (conditionFound.length > 0) {
      Conditions.destroyCondition(idcondition).then(() => {
        res.status(200).send('Condition successfully deleted');
      });
    } else {
      res.status(404).send('Condition not found');
    }
  });
});

module.exports = { conditionsRouter };