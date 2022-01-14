import { Request, Response, NextFunction, Router } from 'express';
import * as MondialRelay from '../models/mondial_relay';
import IMondialRelay from '../interfaces/IMondialRelay';
import { ErrorHandler } from '../helpers/errors';

const mondialRelayRouter = Router();

mondialRelayRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    let sortBy: string = 'id_mondialRelay';
    let order: string = 'ASC';

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

    MondialRelay.getAll(sortBy, order)
      .then((mondialRelay: Array<IMondialRelay>) => {
        res.status(200).json(mondialRelay);
      })
      .catch((err) => next(err));
  }
);

mondialRelayRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    MondialRelay.getById(Number(id))
      .then((mondialRelay: IMondialRelay) => {
        if (mondialRelay === undefined) {
          res.status(404).send('Mondial relay non trouvée');
        }
        res.status(200).json(mondialRelay);
      })
      .catch((err) => next(err));
  }
);

mondialRelayRouter.post(
  '/',
  MondialRelay.nameIsFree,
  MondialRelay.validateMondialRelay,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const mondialRelay = req.body as IMondialRelay;
        mondialRelay.id_mondial_relay = await MondialRelay.create(mondialRelay);
        res.status(201).json(mondialRelay);
      } catch (err) {
        next(err);
      }
    })();
  }
);

mondialRelayRouter.put(
  '/:id',
  MondialRelay.nameIsFree,
  MondialRelay.validateMondialRelay,
  (req: Request, res: Response) => {
    void (async () => {
      const { id } = req.params;

      const mondialRelayUpdated = await MondialRelay.update(
        Number(id),
        req.body as IMondialRelay
      );
      if (mondialRelayUpdated) {
        res.status(200).send('Mondial Relay mis à jour');
      } else if (!mondialRelayUpdated) {
        res.status(404).send('Mondial relay not found');
      } else {
        throw new ErrorHandler(
          500,
          `Ce Mondial Relay ne peut pas être mis à jour`
        );
      }
    })();
  }
);

mondialRelayRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { id } = req.params;
        const mondialRelayDeleted = await MondialRelay.destroy(Number(id));
        if (mondialRelayDeleted) {
          res.status(200).send('Mondial Relay supprimé');
        } else {
          throw new ErrorHandler(404, `Mondial Relay non trouvé`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default mondialRelayRouter;
