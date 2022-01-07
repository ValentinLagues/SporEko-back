import { Request, Response, NextFunction, Router } from 'express';
import * as Offer from '../models/offer';
import IOffer from '../interfaces/IOffer';
import { ErrorHandler } from '../helpers/errors';

const offersRouter = Router();

offersRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  Offer.getAll()
    .then((offers: Array<IOffer>) => {
      res.status(200).json(offers);
    })
    .catch((err) => next(err));
});

offersRouter.get(
  '/:idOffer',
  (req: Request, res: Response, next: NextFunction) => {
    const { idOffer } = req.params;
    Offer.getById(Number(idOffer))
      .then((offer: IOffer) => {
        if (offer === undefined) {
          res.status(404).send('Couleur non trouvée');
        }
        res.status(200).json(offer);
      })
      .catch((err) => next(err));
  }
);

offersRouter.post(
  '/',
  Offer.nameIsFree,
  Offer.codeIsFree,
  Offer.validateOffer,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const offer = req.body as IOffer;
        offer.id_offer = await Offer.create(offer);
        res.status(201).json(offer);
      } catch (err) {
        next(err);
      }
    })();
  }
);

offersRouter.put(
  '/:idOffer',
  Offer.recordExists,
  Offer.nameIsFree,
  Offer.codeIsFree,
  Offer.validateOffer,
  (req: Request, res: Response) => {
    void (async () => {
      const { idOffer } = req.params;

      const offerUpdated = await Offer.update(
        Number(idOffer),
        req.body as IOffer
      );
      if (offerUpdated) {
        res.status(200).send('Couleur mise à jour');
      } else {
        throw new ErrorHandler(
          500,
          `Cette Couleur ne peut pas être mise à jour`
        );
      }
    })();
  }
);

offersRouter.delete(
  '/:idOffer',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idOffer } = req.params;
        const offerDeleted = await Offer.destroy(Number(idOffer));
        if (offerDeleted) {
          res.status(200).send('Couleur supprimée');
        } else {
          throw new ErrorHandler(404, `Couleur non trouvée`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default offersRouter;
