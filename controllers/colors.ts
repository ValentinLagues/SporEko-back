import { Request, Response, NextFunction, Router } from 'express';
import * as Color from '../models/color';
import IColor from '../interfaces/IColor';
import { ErrorHandler } from '../helpers/errors';

const colorsRouter = Router();

colorsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy: string = 'id_color';
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

  Color.getAll(sortBy, order)
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
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const color = req.body as IColor;
        color.id_color = await Color.create(color);
        res.status(201).json(color);
      } catch (err) {
        next(err);
      }
    })();
  }
);

colorsRouter.put(
  '/:idColor',
  Color.recordExists,
  Color.nameIsFree,
  Color.codeIsFree,
  Color.validateColor,
  (req: Request, res: Response) => {
    void (async () => {
      const { idColor } = req.params;

      const colorUpdated = await Color.update(
        Number(idColor),
        req.body as IColor
      );
      if (colorUpdated) {
        res.status(200).send('Couleur mise à jour');
      } else {
        throw new ErrorHandler(
          500,
          `Cette Couleur ne peut pas être mise à jour`
        );
      }
    })();
  }
);

colorsRouter.delete(
  '/:idColor',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idColor } = req.params;
        const colorDeleted = await Color.destroy(Number(idColor));
        if (colorDeleted) {
          res.status(200).send('Couleur supprimée');
        } else {
          throw new ErrorHandler(404, `Couleur non trouvée`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default colorsRouter;
