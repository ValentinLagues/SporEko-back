import { Request, Response, NextFunction, Router } from 'express';
import * as SportifStyles from '../models/sportif_styles';
import ISportifStyles from '../interfaces/ISportifStyles';
import { ErrorHandler } from '../helpers/errors';

const sportifStylesRouter = Router();

sportifStylesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  SportifStyles.getAll()
    .then((sportifStyles: Array<ISportifStyles>) => {
      res.status(200).json(sportifStyles);
    })
    .catch((err) => next(err));
});

sportifStylesRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    SportifStyles.getById(Number(id))
      .then((sportifStyles: ISportifStyles) => res.status(200).json(sportifStyles))
      .catch((err) => next(err));
  }
);

sportifStylesRouter.post(
  '/',
  SportifStyles.nameIsFree,
  SportifStyles.validateSportifStyles,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sportifStyles = req.body as ISportifStyles;
      sportifStyles.id_sportif_style = await SportifStyles.create(sportifStyles);
      res.status(201).json(sportifStyles);
    } catch (err) {
      next(err);
    }
  }
);

sportifStylesRouter.put(
  '/:id',
  SportifStyles.nameIsFree,
  SportifStyles.validateSportifStyles,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const sportifStylesUpdated = await SportifStyles.update(
      Number(id),
      req.body as ISportifStyles
    );
    if (sportifStylesUpdated) {
      res.status(200).send('Sportif Styles mis à jour');
    } else {
      throw new ErrorHandler(500, `Ce Sportif Styles ne peut pas être mis à jour`);
    }
  }
);

sportifStylesRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const sportifStylesDeleted = await SportifStyles.destroy(Number(id));
      if (sportifStylesDeleted) {
        res.status(200).send('Sportif Styles supprimé');
      } else {
        throw new ErrorHandler(404, `Sportif Styles non trouvé`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default sportifStylesRouter;
