import { Request, Response, NextFunction, Router } from 'express';
import SizeType from '../models/sizeType';
import ISizeType from '../interfaces/ISizeType';
import { ErrorHandler } from '../helpers/errors';

const sizeTypesRouter = Router();

sizeTypesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const sortBy = req.query.sortBy as string;
  const order = req.query.order as string;
  const firstItem = req.query.firstItem as string;
  const limit = req.query.limit as string;

  SizeType.getAll(sortBy, order, firstItem, limit)
    .then((sizeTypes: Array<ISizeType>) => {
      res.setHeader(
        'Content-Range',
        `sizeTypes : 0-${sizeTypes.length}/${sizeTypes.length + 1}`
      );
      res.status(200).json(sizeTypes);
    })
    .catch((err) => next(err));
});

sizeTypesRouter.get(
  '/:idSizeType',
  (req: Request, res: Response, next: NextFunction) => {
    const { idSizeType } = req.params;
    SizeType.getById(Number(idSizeType))
      .then((sizeType: ISizeType) => {
        if (sizeType === undefined) {
          res.status(404).send('SizeType not found');
        }
        res.status(200).json(sizeType);
      })
      .catch((err) => next(err));
  }
);

sizeTypesRouter.post(
  '/',
  SizeType.nameIsFree,
  SizeType.validateSizeType,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const sizeType = req.body as ISizeType;
        sizeType.id_sizeType = await SizeType.create(sizeType);
        res.status(201).json(sizeType);
      } catch (err) {
        next(err);
      }
    })();
  }
);

sizeTypesRouter.put(
  '/:idsizeType',
  SizeType.nameIsFree,
  SizeType.validateSizeType,
  (req: Request, res: Response) => {
    void (async () => {
      const { idsizeType } = req.params;

      const sizeTypeUpdated = await SizeType.update(
        Number(idsizeType),
        req.body as ISizeType
      );
      if (sizeTypeUpdated) {
        res.status(200).json({ id: idsizeType });
      } else if (!sizeTypeUpdated) {
        res.status(404).send('SizeType not found');
      } else {
        throw new ErrorHandler(500, `SizeType can't be updated`);
      }
    })();
  }
);

sizeTypesRouter.delete(
  '/:idsizeType',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idsizeType } = req.params;
        const sizeTypeDeleted = await SizeType.destroy(Number(idsizeType));
        if (sizeTypeDeleted) {
          res.status(200).send('SizeType deleted');
        } else {
          throw new ErrorHandler(404, `SizeType not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default sizeTypesRouter;
