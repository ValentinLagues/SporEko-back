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
    const idSizeType = req.params.idSizeType;
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
        const idSizeType = await SizeType.create(sizeType);
        res
          .status(201)
          .json({ id_size_type: idSizeType, id: idSizeType, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

sizeTypesRouter.put(
  '/:idSizeType',
  SizeType.nameIsFree,
  SizeType.validateSizeType,
  (req: Request, res: Response) => {
    void (async () => {
      const idSizeType = req.params.idSizeType;

      const sizeTypeUpdated = await SizeType.update(
        Number(idSizeType),
        req.body as ISizeType
      );
      if (sizeTypeUpdated) {
        res.status(200).json({ id: idSizeType });
      } else if (!sizeTypeUpdated) {
        res.status(404).send('SizeType not found');
      } else {
        throw new ErrorHandler(500, `SizeType can't be updated`);
      }
    })();
  }
);

sizeTypesRouter.delete(
  '/:idSizeType',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idSizeType = req.params.idSizeType;
        const sizeTypeDeleted = await SizeType.destroy(Number(idSizeType));
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
