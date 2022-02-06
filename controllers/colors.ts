import { Request, Response, NextFunction, Router } from 'express';
import Color from '../models/color';
import IColor from '../interfaces/IColor';
import { ErrorHandler } from '../helpers/errors';

const colorsRouter = Router();

colorsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  Color.getAll(sortBy, order, firstItem, limit)
    .then((colors: Array<IColor>) => {
      res.setHeader(
        'Content-Range',
        `colors : 0-${colors.length}/${colors.length + 1}`
      );
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
          res.status(404).send('Color not found');
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
        res.status(200).json({ id: idColor });
      } else {
        throw new ErrorHandler(500, `Color can't be updated`);
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
          res.status(200).send('Color deleted');
        } else {
          throw new ErrorHandler(404, `Color not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default colorsRouter;
