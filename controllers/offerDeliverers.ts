import { Request, Response, NextFunction, Router } from 'express';
import OfferDeliverer from '../models/offerDeliverer';
import IOfferDeliverer from '../interfaces/IOfferDeliverer';
import { ErrorHandler } from '../helpers/errors';

const offerDeliverersRouter = Router();

offerDeliverersRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    const sortBy = 'id_offer_deliverer';
    const order = 'ASC';

    OfferDeliverer.getAll(sortBy, order)
      .then((offerDeliverers: Array<IOfferDeliverer>) => {
        res.status(200).json(offerDeliverers);
      })
      .catch((err) => next(err));
  }
);

offerDeliverersRouter.get(
  '/:idOfferDeliverer',
  (req: Request, res: Response, next: NextFunction) => {
    const idOfferDeliverer = req.params.idOfferDeliverer;
    OfferDeliverer.getById(Number(idOfferDeliverer))
      .then((offerDeliverer: IOfferDeliverer) => {
        if (offerDeliverer === undefined) {
          res.status(404).send('OfferDeliverer not found');
        }
        res.status(200).json(offerDeliverer);
      })
      .catch((err) => next(err));
  }
);

offerDeliverersRouter.post(
  '/',
  OfferDeliverer.validateOfferDeliverer,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const offerDeliverer = req.body as IOfferDeliverer;
        offerDeliverer.id_offerDeliverer = await OfferDeliverer.create(
          offerDeliverer
        );
        res.status(201).json(offerDeliverer);
      } catch (err) {
        next(err);
      }
    })();
  }
);

offerDeliverersRouter.put(
  '/:idOfferDeliverer',
  OfferDeliverer.validateOfferDeliverer,
  (req: Request, res: Response) => {
    void (async () => {
      const idOfferDeliverer = req.params.idOfferDeliverer;

      const offerDelivererUpdated = await OfferDeliverer.update(
        Number(idOfferDeliverer),
        req.body as IOfferDeliverer
      );
      if (offerDelivererUpdated) {
        res.status(200).json({ id: idOfferDeliverer });
      } else if (!offerDelivererUpdated) {
        res.status(404).send('OfferDeliverer not found');
      } else {
        throw new ErrorHandler(500, `OfferDeliverer can't be updated`);
      }
    })();
  }
);

offerDeliverersRouter.delete(
  '/:idOfferDeliverer',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idOfferDeliverer = req.params.idOfferDeliverer;
        const offerDelivererDeleted = await OfferDeliverer.destroy(
          Number(idOfferDeliverer)
        );
        if (offerDelivererDeleted) {
          res.status(200).send('OfferDeliverer deleted');
        } else {
          throw new ErrorHandler(404, `OfferDeliverer not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default offerDeliverersRouter;
