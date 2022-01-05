import { Request, Response, NextFunction, Router } from 'express';
import ISize from '../interfaces/ISize';
import * as Sizes from '../models/size';

const sizesRouter = Router();

sizesRouter.get('/', (_req: Request, res: Response, next: NextFunction) => {
  void (async () => {
    try {
      const results = await Sizes.getAllSizes();
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  })();
});

sizesRouter.get(
  '/:idSize',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idSize } = req.params;
        const result = await Sizes.getSizeById(Number(idSize));
        if (result) res.status(200).json(result);
        else res.status(404).send(`Size id:${idSize} not found.`);
      } catch (err) {
        next(err);
      }
    })();
  }
);

sizesRouter.post(
  '/',
  Sizes.nameIsFree,
  Sizes.validateSize,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const size = req.body as ISize;
      size.id_size = await Sizes.createSize(size);
      res.status(201).json(size);
    } catch (err) {
      next(err);
    }
  }
);

sizesRouter.put(
  '/:idSize',
  Sizes.validateSize,
  Sizes.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idSize } = req.params;
        const { name, is_children } = req.body as ISize;
        const sizeUpdated = await Sizes.updateSize(
          Number(idSize),
          name,
          Number(is_children)
        );
        if (sizeUpdated) {
          res.status(200).send('Size updated');
        } else {
          res.status(404).send('Size not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

sizesRouter.delete('/:idSize', (req: Request, res: Response) => {
  void (async () => {
    const { idSize } = req.params;
    const sizeDeleted = await Sizes.deleteSize(Number(idSize));
    if (sizeDeleted) res.status(201).json(`Size id:${idSize} deleted`);
    else res.status(404).json(`Size id:${idSize} not exist`);
  })();
});

export default sizesRouter;
