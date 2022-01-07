import { Request, Response, NextFunction, Router } from 'express';
import * as Color from '../models/color';
import IColor from '../interfaces/IColor';
import { ErrorHandler } from '../helpers/errors';

const colorsRouter = Router();

colorsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  let sortBy, order, firstItem, limit, ids;

  if (req.query.sort) {
    sortBy = JSON.parse(req.query.sort)[0];
    order = JSON.parse(req.query.sort)[1];
    firstItem = JSON.parse(req.query.range)[0];
    limit = JSON.parse(req.query.range)[1];
  }
  if (req.query.ids) {
    ids = JSON.parse(req.query.ids);
  }
  Color.getAll(sortBy, order, firstItem, limit)
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
      let color = req.body as IColor;
      color.id_color = await Color.create(color);
      color = {
        id_color: color.id_color,
        name: color.name,
        color_code: color.color_code,
      };
      res.status(201).json(color);
    } catch (err) {
      next(err);
    }
  }
);

colorsRouter.put(
  '/:idColor',
  Color.recordExists,
  Color.nameIsFree,
  Color.codeIsFree,
  Color.validateColor,
  async (req: Request, res: Response) => {
    const { idColor } = req.params;
    const colorUpdated = await Color.update(
      Number(idColor),
      req.body as IColor
    );
    if (colorUpdated) {
      res.status(200).send(req.body);
    } else {
      throw new ErrorHandler(500, `Cette Couleur ne peut pas être mise à jour`);
    }
  }
);

colorsRouter.delete(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let ids;
      if (req.query.ids) {
        ids = JSON.parse(req.query.ids);
        ids = ids.id;
      }

      const colorsDeleted = await Color.destroyMany(ids);
      if (colorsDeleted) {
        res.status(200).json(ids);
      } else {
        throw new ErrorHandler(404, `Couleur non trouvée`);
      }
    } catch (err) {
      next(err);
    }
  }
);

colorsRouter.delete(
  '/:idColor',
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default colorsRouter;
