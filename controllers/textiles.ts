import { Request, Response, NextFunction, Router } from 'express';
import * as Textile from '../models/textile';
import ITextile from '../interfaces/ITextile';
import { ErrorHandler } from '../helpers/errors';

const textilesRouter = Router();

textilesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Textile.getAll()
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const textile = req.body as ITextile;
      textile.id_textile = await Textile.create(textile);
      res.status(201).json(textile);
    } catch (err) {
      next(err);
    }
  }
);

textilesRouter.put(
  '/:idtextile',
  Textile.nameIsFree,
  Textile.validateTextile,
  async (req: Request, res: Response) => {
    const { idtextile } = req.params;

    const textileUpdated = await Textile.update(
      Number(idtextile),
      req.body as ITextile
    );
    if (textileUpdated) {
      res.status(200).send('Matière mis à jour');
    } else {
      throw new ErrorHandler(500, `Cette matière ne peut pas être mis à jour`);
    }
  }
);

textilesRouter.delete(
  '/:idtextile',
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default textilesRouter;
