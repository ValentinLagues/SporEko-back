import { Request, Response, NextFunction, Router } from 'express';
import ISize from '../interfaces/ISize';
import { ErrorHandler } from '../helpers/errors';
import * as Sizes from '../models/size';

const sizesRouter = Router();

sizesRouter.get('/', (_req: Request, res: Response, next: NextFunction) => {
  async () => {
    try {
      const results = await Sizes.getAllSizes();
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  };
});

sizesRouter.get(
  '/:idSize',
  (req: Request, res: Response, next: NextFunction) => {
    async () => {
      try {
        const { idSize } = req.params;
        const result = await Sizes.getSizeById(Number(idSize));
        if (result) res.status(200).json(result);
        else
          res.status(404).send(`La taille avec id:${idSize} est introuvable.`);
      } catch (err) {
        next(err);
      }
    };
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
  Sizes.nameIsFree,
  Sizes.validateSize,
  async (req: Request, res: Response) => {
    const { idSize } = req.params;
    const { name, is_children } = req.body as ISize;
    const sizeUpdated = await Sizes.updateSize(
      Number(idSize),
      name,
      Number(is_children)
    );
    if (sizeUpdated) {
      res.status(200).send('Taille mise à jour');
    } else {
      throw new ErrorHandler(500, `La taille n'a pas pu être mise à jour.`);
    }
  }
);

sizesRouter.delete('/:idSize', (req: Request, res: Response) => {
  async () => {
    const { idSize } = req.params;
    const sizeDeleted = await Sizes.destroySize(Number(idSize));
    if (sizeDeleted)
      res.status(201).json(`La taille avec l'id:${idSize} à était supprimé`);
    else res.status(404).json(`La taille avec l'id:${idSize} n'existe pas`);
  };
});

export default sizesRouter;