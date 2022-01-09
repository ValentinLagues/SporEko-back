import { Request, Response, NextFunction, Router } from 'express';
import * as Accessory from '../models/accessory';
import IAccessory from '../interfaces/IAccessory';
import { ErrorHandler } from '../helpers/errors';

const accessoriesRouter = Router();

accessoriesRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    Accessory.getAll()
      .then((accessories: Array<IAccessory>) => {
        res.status(200).json(accessories);
      })
      .catch((err) => next(err));
  }
);

accessoriesRouter.get(
  '/:idAccessory',
  (req: Request, res: Response, next: NextFunction) => {
    const { idAccessory } = req.params;
    Accessory.getById(Number(idAccessory))
      .then((accessory: IAccessory) => {
        if (accessory === undefined) {
          res.status(404).send('Categorie non trouvée');
        }
        res.status(200).json(accessory);
      })
      .catch((err) => next(err));
  }
);

accessoriesRouter.post(
  '/',
  Accessory.nameIsFree,
  Accessory.validateAccessory,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const accessory = req.body as IAccessory;
        accessory.id_accessory = await Accessory.create(accessory);
        res.status(201).json(accessory);
      } catch (err) {
        next(err);
      }
    })();
  }
);

accessoriesRouter.put(
  '/:idAccessory',
  Accessory.nameIsFree,
  Accessory.validateAccessory,
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idAccessory } = req.params;
        const accessoryUpdated = await Accessory.update(
          Number(idAccessory),
          req.body as IAccessory
        );
        if (accessoryUpdated) {
          res.status(200).send('Accessory updated');
        } else {
          res.status(404).send('Accessory not found');
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

accessoriesRouter.delete(
  '/:idAccessory',
  (req: Request, res: Response, next: NextFunction) => {
    void (async () => {
      try {
        const { idAccessory } = req.params;
        const accessoryDeleted = await Accessory.destroy(Number(idAccessory));
        if (accessoryDeleted) {
          res.status(200).send('Categorie supprimée');
        } else {
          throw new ErrorHandler(404, `Categorie non trouvée`);
        }
      } catch (err) {
        next(err);
      }
    })();
  }
);

export default accessoriesRouter;
