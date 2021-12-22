import { Request, Response, NextFunction, Router } from 'express';
import * as Color from '../models/color';
import IColor from '../interfaces/IColor';
import { ErrorHandler } from '../helpers/errors';

const colorsRouter = Router();

colorsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Color.getAll()
    .then((colors: Array<IColor>) => {
      res.status(200).json(colors);
    })
    .catch((err) => next(err));
});

colorsRouter.get(
  '/:idColor',
  (req: Request, res: Response, next: NextFunction) => {
    const { idColor } = req.params;
    Color.getById(Number(idColor))
      .then((color: IColor) => {
        if (color === undefined) {
          res.status(404).send('Couleur non trouvée');
        }
        res.status(200).json(color);
      })
      .catch((err) => next(err));
  }
);

colorsRouter.post(
  '/',
  Color.nameIsFree,
  Color.codeIsFree,
  Color.validateColor,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const color = req.body as IColor;
      color.id_color = await Color.create(color);
      res.status(201).json(color);
    } catch (err) {
      next(err);
    }
  }
);

colorsRouter.put(
  '/:idcolor',
  Color.recordExists,
  Color.nameIsFree,
  Color.codeIsFree,
  Color.validateColor,
  async (req: Request, res: Response) => {
    const { idcolor } = req.params;

    const colorUpdated = await Color.update(
      Number(idcolor),
      req.body as IColor
    );
    if (colorUpdated) {
      res.status(200).send('Couleur mise à jour');
    } else {
      throw new ErrorHandler(500, `Cette Couleur ne peut pas être mise à jour`);
    }
  }
);

colorsRouter.delete(
  '/:idcolor',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idcolor } = req.params;
      const colorDeleted = await Color.destroy(Number(idcolor));
      if (colorDeleted) {
        res.status(200).send('Couleur supprimée');
      } else {
        throw new ErrorHandler(404, `Couleur non trouvée`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default colorsRouter;
