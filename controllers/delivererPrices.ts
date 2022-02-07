import { Request, Response, NextFunction, Router } from 'express';
import IDelivererPrice from '../interfaces/IDelivererPrice';
import DelivererPrice from '../models/delivererPrice';

const delivererPricesRouter = Router();

delivererPricesRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const firstItem = req.query.firstItem as string;
    const limit = req.query.limit as string;
    const idDeliverer= req.query.idDeliverer as string;
    const weight = req.query.weight as string;

    DelivererPrice.getAllDelivererPrice(sortBy, order, firstItem, limit, idDeliverer, weight)
      .then((delivererPrices: Array<IDelivererPrice>) => {
        res.setHeader(
          'Content-Range',
          `delivererPrices : 0-${delivererPrices.length}/${
            delivererPrices.length + 1
          }`
        );
        res.status(200).json(delivererPrices);
      })
      .catch((err) => next(err));
  }
);

delivererPricesRouter.get(
  '/:idDelivererPrice',
  (req: Request, res: Response, next: NextFunction) => {
    const idDelivererPrice = req.params.idDelivererPrice;
    DelivererPrice.getDelivererPriceById(Number(idDelivererPrice))
      .then((result: IDelivererPrice) => {
        if (result === undefined)
          res.status(404).send('DelivererPrice not found');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

delivererPricesRouter.post(
  '/',
  DelivererPrice.validateDelivererPrice,
  DelivererPrice.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const delivererPrice = req.body as IDelivererPrice;
        const idDelivererPrice = await DelivererPrice.create(delivererPrice);
        res.status(201).json({
          id_deliverer_price: idDelivererPrice,
          id: idDelivererPrice,
          ...req.body,
        });
      } catch (err) {
        next(err);
      }
    })();
  }
);

delivererPricesRouter.put(
  '/:idDelivererPrice',
  DelivererPrice.validateDelivererPrice,
  DelivererPrice.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idDelivererPrice = req.params.idDelivererPrice;
        const delivererPriceUpdated = await DelivererPrice.updateDelivererPrice(
          Number(idDelivererPrice),
          req.body as IDelivererPrice
        );
        if (delivererPriceUpdated) {
          res.status(200).json({ id: idDelivererPrice });
        } else {
          res.status(404).send('DelivererPrice not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

delivererPricesRouter.delete(
  '/:idDelivererPrice',
  (req: Request, res: Response, next: NextFunction) => {
    const idDelivererPrice = req.params.idDelivererPrice;
    DelivererPrice.deleteDelivererPrice(Number(idDelivererPrice))
      .then((deletedDelivererPrice) => {
        if (deletedDelivererPrice)
          res.status(201).json(`DelivererPrice deleted`);
        else res.status(404).json(`DelivererPrice not found`);
      })
      .catch((err) => next(err));
  }
);

export default delivererPricesRouter;
