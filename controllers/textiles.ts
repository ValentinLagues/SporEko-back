import { Request, Response, NextFunction, Router } from 'express';
import * as Textile from '../models/textile';
import ITextile from '../interfaces/ITextile';
import { ErrorHandler } from '../helpers/errors';

const textilesRouter = Router();

textilesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_textile';
  let order: string = 'ASC';

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
          res.status(404).send('Textile not found');
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
        res.status(200).send('Textile updated');
      } else if (!textileUpdated) {
        res.status(404).send('Textile not found');
      } else {
        throw new ErrorHandler(500, `Textile can't be updated`);
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
          res.status(200).send('Textile deleted');
        } else {
          throw new ErrorHandler(404, `Textile not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default textilesRouter;
