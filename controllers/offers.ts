import { Request, Response, NextFunction, Router } from 'express';
import Offer from '../models/offer';
import IOffer from '../interfaces/IOffer';
import OfferDeliverer from '../models/offerDeliverer';
import Deliverer from '../models/deliverer';
import { ErrorHandler } from '../helpers/errors';

const offersRouter = Router();

interface IFilter {
  sortBy: string | undefined;
  order: string | undefined;
  firstItem: string | undefined;
  limit: string | undefined;
  title: string | undefined;
  id_user_seller: number | undefined;
  id_sport: number | undefined;
  id_gender: number | undefined;
  is_child: number | undefined;
  id_category: number | undefined;
  id_item: number | undefined;
  id_brand: number | undefined;
  id_textile: number | undefined;
  id_size: number | undefined;
  id_color1: number | undefined;
  id_color2: number | undefined;
  id_condition: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

offersRouter.get(
  '/',
  (req: Request<IFilter>, res: Response, next: NextFunction) => {
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const firstItem = req.query.firstItem as string;
    const limit = req.query.limit as string;
    const title = req.query.title as string;

    const {
      id_user_seller,
      id_sport,
      id_gender,
      is_child,
      id_category,
      id_item,
      id_brand,
      id_textile,
      id_size,
      id_color1,
      id_condition,
      minPrice,
      maxPrice,
    } = req.query;
    Offer.getAll(
      sortBy,
      order,
      firstItem,
      limit,
      Number(id_user_seller),
      title,
      Number(id_sport),
      Number(id_gender),
      Number(is_child),
      Number(id_category),
      Number(id_item),
      Number(id_brand),
      Number(id_textile),
      Number(id_size),
      Number(id_color1),
      Number(id_condition),
      Number(minPrice),
      Number(maxPrice)
    )
      .then((offers: Array<IOffer>) => {
        res.setHeader(
          'Content-Range',
          `offers : 0-${offers.length}/${offers.length + 1}`
        );
        res.status(200).json(offers);
      })
      .catch((err) => next(err));
  }
);

offersRouter.get(
  '/:idOffer',
  (req: Request, res: Response, next: NextFunction) => {
    const idOffer = req.params.idOffer;
    Offer.getById(Number(idOffer))
      .then((offer: IOffer) => {
        if (offer === undefined) {
          res.status(404).send('Offer not found');
        }
        res.status(200).json(offer);
      })
      .catch((err) => next(err));
  }
);
offersRouter.get(
  '/:idOffer/deliverers',

  (req: Request, res: Response, next: NextFunction) => {
    const idOffer = req.params.idOffer;
    Deliverer.getDeliverersByIdOffer(Number(idOffer))
      .then((deliverers) => {
        if (deliverers === undefined) {
          res.status(404).send('Offer not found');
        }
        res.status(200).json(deliverers);
      })
      .catch((err) => next(err));
  }
);
offersRouter.get(
  '/:idOffer/offer_deliv',

  (req: Request, res: Response, next: NextFunction) => {
    const idOffer = req.params.idOffer;
    OfferDeliverer.getDelivByIdOffer(Number(idOffer))
      .then((deliverers) => {
        if (deliverers === undefined) {
          res.status(404).send('Offer not found');
        }
        res.status(200).json(deliverers);
      })
      .catch((err) => next(err));
  }
);

offersRouter.post(
  '/images',
  Offer.upload.array('imagesOffers', 20),
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const reqFile: any = req.files;
        const pictures: Array<string> = [];
        reqFile.map((el: any) => {
          const url = `${req.protocol}://${req.get('host')}/${el.path}`;
          pictures.push(url);
        });
        const offer = { ...pictures };
        res.status(201).json(offer);
      } catch (err) {
        next(err);
      }
    })();
  }
);

offersRouter.post(
  '/',
  Offer.validateOffer,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const offer = req.body as IOffer;
        const idOffer = await Offer.create(offer);
        res.status(201).json({ id_offer: idOffer, id: idOffer, ...req.body });
      } catch (err) {
        next(err);
      }
    })();
  }
);

offersRouter.put(
  '/:idOffer',
  Offer.recordExists,
  Offer.validateOffer,
  (req: Request, res: Response) => {
    void (async () => {
      const idOffer = req.params.idOffer;

      const offerUpdated = await Offer.update(
        Number(idOffer),
        req.body as IOffer
      );
      if (offerUpdated) {
        res.status(200).json({ id: idOffer });
      } else {
        throw new ErrorHandler(500, `Offer can't be updated`);
      }
    })();
  }
);

offersRouter.delete(
  '/:idOffer',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idOffer = req.params.idOffer;
        const offerDeleted = await Offer.destroy(Number(idOffer));
        if (offerDeleted) {
          res.status(200).send('Offer deleted');
        } else {
          throw new ErrorHandler(404, `Offer not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);
offersRouter.delete(
  '/:idOffer/offer_deliverers',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const idOffer = req.params.idOffer;
        const offerDeliverersDeleted = await OfferDeliverer.destroyByIdOffer(
          Number(idOffer)
        );
        if (offerDeliverersDeleted) {
          res.status(200).send('Offer deliverers deleted');
        } else {
          throw new ErrorHandler(404, `Offer deliverers not found`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default offersRouter;
