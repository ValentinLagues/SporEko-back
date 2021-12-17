const sportsRouter = require('express').Router();
import { Request, Response } from 'express';
const Sport = require('../models/sport');

interface SportInfo {
  name: string;
}

///////////// SPORTS ///////////////

sportsRouter.get('/', (req: Request, res: Response) => {
  Sport.findManySport().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

sportsRouter.get('/:idsport', (req: Request, res: Response) => {
  const { idsport } = req.params;
  Sport.findOneSport(idsport).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Sport non trouvé');
    }
  });
});

sportsRouter.post('/', (req: Request, res: Response) => {
  const sport: SportInfo = req.body;
  const joiErrors = Sport.validateSport(sport);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Sport.createSport(sport)
      .then(([createdSport]: Array<any>) => {
        const id = createdSport.insertId;
        res.status(201).json({ id, ...sport });
        // console.log(createdSport);
        // res.status(201).json(createdSport);
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
        // console.log(error);
      });
  }
});

sportsRouter.put('/:idsport', (req: Request, res: Response) => {
  const { idsport } = req.params;
  Sport.findOneSport(idsport).then(([sportFound]: Array<any>) => {
    if (sportFound.length > 0) {
      const sport: SportInfo = req.body;
      const joiErrors = Sport.validateSport(sport, false);
      if (joiErrors) {
        console.log('dans if');
        res.status(409).send(joiErrors.details);
      } else {
        Sport.updateSport(idsport, sport).then(() => {
          // console.log(updatedSport);
          // console.log({ ...sportFound, ...sport });
          res.status(200).json({ ...sportFound[0], ...sport });
          // const id_sport = updatedSport[0].insertId
          // res.status(201).json(updatedSport)
        });
      }
    } else {
      res.status(404).send('Sport non trouvé');
    }
  });
});

sportsRouter.delete('/:idsport', (req: Request, res: Response)=>{
    const { idsport } = req.params;
    Sport.findOneSport(idsport).then(([sportFound]: Array<any>)=>{
        if (sportFound.length > 0) {
          Sport.destroySport(idsport).then(()=>{
              res.status(404).send('Sport supprimé');
          });
        } else {
            res.status(404).send('Sport non trouvé (vérif id)');
        }
    });
});

module.exports = { sportsRouter };
