import { Request, Response, NextFunction, Router } from 'express';
import IDeliverer_price from '../interfaces/IDeliverer_price';
import * as Deliverer_price from '../models/deliverer_price';

const deliverer_pricesRouter = Router();

deliverer_pricesRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    let sortBy = 'id_deliverer_price';
    let order = 'ASC';

    const {
      sort,
      // firstDeliverer_price,
      // limit
    } = req.query;

    if (sort) {
      const sortToArray = sort.toString().split(' ');
      sortBy = sortToArray[0];
      order = sortToArray[1];
    }

    Deliverer_price.getAllDeliverer_price(sortBy, order)
      .then((results) => res.status(200).json(results))
      .catch((err) => next(err));
  }
);

deliverer_pricesRouter.get(
  '/:idDeliverer_price',
  (req: Request, res: Response, next: NextFunction) => {
    const { idDeliverer_price } = req.params;
    Deliverer_price.getDeliverer_priceById(Number(idDeliverer_price))
      .then((result: IDeliverer_price) => {
        if (result === undefined)
          res.status(404).send('Deliverer_price not found');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

deliverer_pricesRouter.get(
  '/:price',
  (req: Request, res: Response, next: NextFunction) => {
    const { price } = req.params;
    Deliverer_price.getDeliverer_priceByPrice(Number(price))
      .then((result: IDeliverer_price) => {
        if (result === undefined)
          res.status(404).send('Deliverer_price not found');
        else res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

deliverer_pricesRouter.post(
  '/',
  Deliverer_price.validateDeliverer_price,
  Deliverer_price.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    const deliverer_price = req.body as IDeliverer_price;
    Deliverer_price.createDeliverer_price(deliverer_price)
      .then((createDeliverer_price) =>
        res.status(201).json({ id: createDeliverer_price, ...req.body })
      )
      .catch((err) => next(err));
  }
);

deliverer_pricesRouter.put(
  '/:idDeliverer_price',
  Deliverer_price.validateDeliverer_price,
  Deliverer_price.nameIsFree,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idDeliverer_price } = req.params;
        const deliverer_priceUpdated =
          await Deliverer_price.updateDeliverer_price(
            Number(idDeliverer_price),
            req.body as IDeliverer_price
          );
        if (deliverer_priceUpdated) {
          res.status(200).send('Deliverer_price updated');
        } else {
          res.status(404).send('Deliverer_price not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

deliverer_pricesRouter.delete(
  '/:idDeliverer_price',
  (req: Request, res: Response, next: NextFunction) => {
    const { idDeliverer_price } = req.params;
    Deliverer_price.deleteDeliverer_price(Number(idDeliverer_price))
      .then((deletedDeliverer_price) => {
        if (deletedDeliverer_price)
          res.status(201).json(`Deliverer_price deleted`);
        else res.status(404).json(`Deliverer_price not found`);
      })
      .catch((err) => next(err));
  }
);

export default deliverer_pricesRouter;
