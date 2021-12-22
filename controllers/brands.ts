import { Request, Response, NextFunction, Router } from 'express';
import * as Brand from '../models/brand';
import IBrand from '../interfaces/IBrand';
import { ErrorHandler } from '../helpers/errors';

const brandsRouter = Router();

brandsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Brand.getAll()
    .then((brands: Array<IBrand>) => {
      res.status(200).json(brands);
    })
    .catch((err) => next(err));
});

brandsRouter.get(
  '/:idBrand',
  (req: Request, res: Response, next: NextFunction) => {
    const { idBrand } = req.params;
    Brand.getById(Number(idBrand))
      .then((brand: IBrand) => {
        if (brand === undefined) {
          res.status(404).send('Marque non trouvée');
        }
        res.status(200).json(brand);
      })
      .catch((err) => next(err));
  }
);

brandsRouter.post(
  '/',
  Brand.nameIsFree,
  Brand.validateBrand,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brand = req.body as IBrand;
      brand.id_brand = await Brand.create(brand);
      res.status(201).json(brand);
    } catch (err) {
      next(err);
    }
  }
);

brandsRouter.put(
  '/:idBrand',
  Brand.recordExists,
  Brand.nameIsFree,
  Brand.validateBrand,
  async (req: Request, res: Response) => {
    const { idBrand } = req.params;
    const brandUpdated = await Brand.update(
      Number(idBrand),
      req.body as IBrand
    );
    if (brandUpdated) {
      res.status(200).send('Marque mise à jour');
    } else {
      throw new ErrorHandler(500, `Cette marque ne peut pas être mise à jour`);
    }
  }
);

brandsRouter.delete(
  '/:idBrand',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idBrand } = req.params;
      const brandDeleted = await Brand.destroy(Number(idBrand));
      if (brandDeleted) {
        res.status(200).send('Marque supprimée');
      } else {
        throw new ErrorHandler(404, `Marque non trouvée`);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default brandsRouter;