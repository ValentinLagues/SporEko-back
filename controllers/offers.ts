import { Request, Response, NextFunction, Router } from 'express';
import * as Offer from '../models/offer';
import IOffer from '../interfaces/IOffer';
import { ErrorHandler } from '../helpers/errors';

const offersRouter = Router();

interface IFilter {
  sort: string | undefined;
  // firstItem: number;
  // limit: number;
  id_user_seller: number | undefined;
  id_sport: number | undefined;
  id_gender: number | undefined;
  ischild: number | undefined;
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
    let sortBy = 'creation_date';
    let order = 'DESC';

    const {
      sort,
      // firstItem,
      // limit,
      id_user_seller,
      id_sport,
      id_gender,
      ischild,
      id_category,
      id_item,
      id_brand,
      id_textile,
      id_size,
      id_color1,
      id_color2,
      id_condition,
      minPrice,
      maxPrice,
    } = req.query;
    if (sort) {
      const sortToArray = sort.toString().split(' ');
      sortBy = sortToArray[0];
      order = sortToArray[1];
    }
    Offer.getAll(
      sortBy,
      order,
      // firstItem,
      // limit,
      Number(id_user_seller),
      Number(id_sport),
      Number(id_gender),
      Number(ischild),
      Number(id_category),
      Number(id_item),
      Number(id_brand),
      Number(id_textile),
      Number(id_size),
      Number(id_color1),
      Number(id_color2),
      Number(id_condition),
      Number(minPrice),
      Number(maxPrice)
    )
      .then((offers: Array<IOffer>) => {
        res.status(200).json(offers);
      })
      .catch((err) => next(err));
  }
);

offersRouter.get(
  '/:idOffer',
  (req: Request, res: Response, next: NextFunction) => {
    const { idOffer } = req.params;
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

offersRouter.post(
  '/images',
  Offer.upload.array('imagesOffers', 20),
  Offer.validateOffer,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const reqFile: any = req.files;
        const pictures: Array<string> = [];
        reqFile.map((el: any) => {
          const url = `${req.protocol}://${req.get('host')}/${el.path}`;
          pictures.push(url);
        });
        const offer = await { ...pictures };
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
        console.log('check');
        offer.id_offer = await Offer.create(offer);
        console.log(offer.id_offer);
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
  Offer.validateOffer,
  (req: Request, res: Response) => {
    void (async () => {
      const { idOffer } = req.params;

      const offerUpdated = await Offer.update(
        Number(idOffer),
        req.body as IOffer
      );
      if (offerUpdated) {
        res.status(200).send('Offer updated');
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
        const { idOffer } = req.params;
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

export default offersRouter;
