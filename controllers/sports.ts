import { Request, Response, NextFunction, Router } from 'express';
import * as Sport from '../models/sport';
import ISport from '../interfaces/ISport';
import { ErrorHandler } from '../helpers/errors';

const sportsRouter = Router();

sportsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Sport.getAll()
    .then((sports: Array<ISport>) => {
      res.status(200).json(sports);
    })
    .catch((err) => next(err));
});

sportsRouter.get(
  '/:idSport',
  (req: Request, res: Response, next: NextFunction) => {
    const { idSport } = req.params;
    Sport.getById(Number(idSport))
      .then((sport:ISport) => {
        if (sport === undefined) {
          res.status(404).send('Sport non trouvé');
        }
        res.status(200).json(sport);
      })  
      .catch((err) => next(err));
  }
);

sportsRouter.post(
  '/',
  Sport.nameIsFree,
  Sport.validateSport,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sport = req.body as ISport;
      sport.id_sport = await Sport.create(sport);
      res.status(201).json(sport);
    } catch (err) {
      next(err);
    }
  }
);

sportsRouter.put(
  '/:idsport',
  Sport.nameIsFree,
  Sport.validateSport,
  async (req: Request, res: Response) => {
    const { idsport } = req.params;

    const sportUpdated = await Sport.update(
      Number(idsport),
      req.body as ISport
    );
    if (sportUpdated) {
      res.status(200).send('Sport mis à jour');
    } else {
      throw new ErrorHandler(500, `Ce sport ne peut pas être mis à jour`);
    }
  }
);

sportsRouter.delete(
  '/:idsport',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idsport } = req.params;
      const sportDeleted = await Sport.destroy(Number(idsport));
      if (sportDeleted) {
        res.status(200).send('Sport supprimé');
      } else {
        throw new ErrorHandler(404, `Sport non trouvé`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default sportsRouter;

// const sportsRouter = require('express').Router();
// import { Request, Response } from 'express';
// const Sport = require('../models/sport');

// interface SportInfo {
//   name: string;
// }

// sportsRouter.get('/', (req: Request, res: Response) => {
//   Sport.findManySport().then(([result]: Array<any>) => {
//     res.status(200).json(result);
//   });
// });

// sportsRouter.get('/:idsport', (req: Request, res: Response) => {
//   const { idsport } = req.params;
//   Sport.findOneSport(idsport).then(([result]: Array<any>) => {
//     if (result.length > 0) {
//       res.json(result);
//     } else {
//       res.status(404).send('Sport non trouvé');
//     }
//   });
// });

// sportsRouter.post('/', (req: Request, res: Response) => {
//   const sport: SportInfo = req.body;
//   const joiErrors = Sport.validateSport(sport);
//   if (joiErrors) {
//     res.status(422).send(joiErrors.details);
//   } else {
//     Sport.createSport(sport)
//       .then(([createdSport]: Array<any>) => {
//         const id = createdSport.insertId;
//         res.status(201).json({ id, ...sport });
//         // console.log(createdSport);
//         // res.status(201).json(createdSport);
//       })
//       .catch((error: Array<any>) => {
//         res.status(500).send(error);
//         // console.log(error);
//       });
//   }
// });

// sportsRouter.put('/:idsport', (req: Request, res: Response) => {
//   const { idsport } = req.params;
//   Sport.findOneSport(idsport).then(([sportFound]: Array<any>) => {
//     if (sportFound.length > 0) {
//       const sport: SportInfo = req.body;
//       const joiErrors = Sport.validateSport(sport, false);
//       if (joiErrors) {
//         console.log('dans if');
//         res.status(409).send(joiErrors.details);
//       } else {
//         Sport.updateSport(idsport, sport).then(() => {
//           // console.log(updatedSport);
//           // console.log({ ...sportFound, ...sport });
//           res.status(200).json({ ...sportFound[0], ...sport });
//           // const id_sport = updatedSport[0].insertId
//           // res.status(201).json(updatedSport)
//         });
//       }
//     } else {
//       res.status(404).send('Sport non trouvé');
//     }
//   });
// });

// sportsRouter.delete('/:idsport', (req: Request, res: Response)=>{
//     const { idsport } = req.params;
//     Sport.findOneSport(idsport).then(([sportFound]: Array<any>)=>{
//         if (sportFound.length > 0) {
//           Sport.destroySport(idsport).then(()=>{
//               res.status(404).send('Sport supprimé');
//           });
//         } else {
//             res.status(404).send('Sport non trouvé (vérif id)');
//         }
//     });
// });

// module.exports = { sportsRouter };
