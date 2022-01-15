import { Request, Response, NextFunction, Router } from 'express';
import * as Textile from '../models/textile';
import ITextile from '../interfaces/ITextile';
import { ErrorHandler } from '../helpers/errors';

const textilesRouter = Router();

textilesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy = 'id_textile';
  let order = 'ASC';

  const {
    sort,
    // firstItem,
    // limit
  } = req.query;

  if (sort) {
    const sortToArray = sort.toString().split(' ');
    sortBy = sortToArray[0];
    order = sortToArray[1];
  }

  Textile.getAll(sortBy, order)
    .then((textiles: Array<ITextile>) => {
      res.status(200).json(textiles);
    })
    .catch((err) => next(err));
});

textilesRouter.get(
  '/:idTextile',
  (req: Request, res: Response, next: NextFunction) => {
    const { idTextile } = req.params;
    Textile.getById(Number(idTextile))
      .then((textile: ITextile) => {
        if (textile === undefined) {
          res.status(404).send('Matière non trouvée');
        }
        res.status(200).json(textile);
      })
      .catch((err) => next(err));
  }
);

textilesRouter.post(
  '/',
  Textile.nameIsFree,
  Textile.validateTextile,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const textile = req.body as ITextile;
        textile.id_textile = await Textile.create(textile);
        res.status(201).json(textile);
      } catch (err) {
        next(err);
      }
    })();
  }
);

textilesRouter.put(
  '/:idtextile',
  Textile.nameIsFree,
  Textile.validateTextile,
  (req: Request, res: Response) => {
    void (async () => {
      const { idtextile } = req.params;

      const textileUpdated = await Textile.update(
        Number(idtextile),
        req.body as ITextile
      );
      if (textileUpdated) {
        res.status(200).send('Matière mis à jour');
      } else if (!textileUpdated) {
        res.status(404).send('Textile not found');
      } else {
        throw new ErrorHandler(
          500,
          `Cette matière ne peut pas être mis à jour`
        );
      }
    })();
  }
);

textilesRouter.delete(
  '/:idtextile',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idtextile } = req.params;
        const textileDeleted = await Textile.destroy(Number(idtextile));
        if (textileDeleted) {
          res.status(200).send('Matière supprimée');
        } else {
          throw new ErrorHandler(404, `Matière non trouvée`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default textilesRouter;

// textilesRouter.get('/:idtextile', (req: Request, res: Response) => {
//   const { idtextile } = req.params;
//   Textile.findOneTextile(idtextile).then(([result]: Array<any>) => {
//     if (result.length > 0) {
//       res.json(result);
//     } else {
//       res.status(404).send('Textile non trouvé');
//     }
//   });
// });

// textilesRouter.post('/', (req: Request, res: Response) => {
//   const textile: TextileInfo = req.body;
//   const joiErrors = Textile.validateTextile(textile);
//   if (joiErrors) {
//     res.status(422).send(joiErrors.details);
//   } else {
//     Textile.createTextile(textile)
//       .then(([createdTextile]: Array<any>) => {
//         const id = createdTextile.insertId;
//         res.status(201).json({ id, ...textile });
//         // console.log(createdTextile);
//         // res.status(201).json(createdTextile);
//       })
//       .catch((error: Array<any>) => {
//         res.status(500).send(error);
//         // console.log(error);
//       });
//   }
// });

// textilesRouter.put('/:idtextile', (req: Request, res: Response) => {
//   const { idtextile } = req.params;
//   Textile.findOneTextile(idtextile).then(([textileFound]: Array<any>) => {
//     if (textileFound.length > 0) {
//       const textile: TextileInfo = req.body;
//       const joiErrors = Textile.validateTextile(textile, false);
//       if (joiErrors) {
//         console.log('dans if');
//         res.status(409).send(joiErrors.details);
//       } else {
//         Textile.updateTextile(idtextile, textile).then(() => {
//           // console.log(updatedTextile);
//           // console.log({ ...textileFound, ...textile });
//           res.status(200).json({ ...textileFound[0], ...textile });
//           // const id_textile = updatedTextile[0].insertId
//           // res.status(201).json(updatedTextile)
//         });
//       }
//     } else {
//       res.status(404).send('Textile non trouvé');
//     }
//   });
// });

// textilesRouter.delete('/:idtextile', (req: Request, res: Response)=>{
//     const { idtextile } = req.params;
//     Textile.findOneTextile(idtextile).then(([textileFound]: Array<any>)=>{
//         if (textileFound.length > 0) {
//           Textile.destroyTextile(idtextile).then(()=>{
//               res.status(404).send('Textile supprimé');
//           });
//         } else {
//             res.status(404).send('Textile non trouvé (vérif id)');
//         }
//     });
// });

// module.exports = { textilesRouter };
