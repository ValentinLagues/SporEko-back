import { Request, Response, NextFunction, Router } from 'express';
import * as Offer_deliverer from '../models/offer_deliverer';
import IOffer_deliverer from '../interfaces/IOffer_deliverer';
import { ErrorHandler } from '../helpers/errors';

const offer_deliverersRouter = Router();

offer_deliverersRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    let sortBy = 'id_offer_deliverer';
    let order = 'ASC';

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

    Offer_deliverer.getAll(sortBy, order)
      .then((offer_deliverers: Array<IOffer_deliverer>) => {
        res.status(200).json(offer_deliverers);
      })
      .catch((err) => next(err));
  }
);

offer_deliverersRouter.get(
  '/:idOffer_deliverer',
  (req: Request, res: Response, next: NextFunction) => {
    const { idOffer_deliverer } = req.params;
    Offer_deliverer.getById(Number(idOffer_deliverer))
      .then((offer_deliverer: IOffer_deliverer) => {
        if (offer_deliverer === undefined) {
          res.status(404).send('Offer_deliverer not found');
        }
        res.status(200).json(offer_deliverer);
      })
      .catch((err) => next(err));
  }
);

offer_deliverersRouter.post(
  '/',
  Offer_deliverer.validateOffer_deliverer,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const offer_deliverer = req.body as IOffer_deliverer;
        offer_deliverer.id_offer_deliverer = await Offer_deliverer.create(
          offer_deliverer
        );
        res.status(201).json(offer_deliverer);
      } catch (err) {
        next(err);
      }
    })();
  }
);

offer_deliverersRouter.put(
  '/:idOffer_deliverer',
  Offer_deliverer.validateOffer_deliverer,
  (req: Request, res: Response) => {
    void (async () => {
<<<<<<< HEAD
      const { idoffer_deliverer } = req.params as IOffer_deliverer;
=======
      const { idOffer_deliverer } = req.params;
>>>>>>> 370f8001eac8a7718fdbaad86b0d3b0755bdd2eb

      const offer_delivererUpdated = await Offer_deliverer.update(
        Number(idOffer_deliverer),
        req.body as IOffer_deliverer
      );
      if (offer_delivererUpdated) {
        res.status(200).send('Offer_deliverer updated');
      } else if (!offer_delivererUpdated) {
        res.status(404).send('Offer_deliverer not found');
      } else {
        throw new ErrorHandler(500, `Offer_deliverer can't be updated`);
      }
    })();
  }
);

offer_deliverersRouter.delete(
  '/:idOffer_deliverer',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idOffer_deliverer } = req.params;
        const offer_delivererDeleted = await Offer_deliverer.destroy(
          Number(idOffer_deliverer)
        );
        if (offer_delivererDeleted) {
          res.status(200).send('Offer_deliverer deleted');
        } else {
          throw new ErrorHandler(404, `Offer_deliverer not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default offer_deliverersRouter;
