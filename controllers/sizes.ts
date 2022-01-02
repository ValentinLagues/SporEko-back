import { Request, Response, NextFunction } from 'express';
import ISize from '../interfaces/ISize';
import { ErrorHandler } from '../helpers/errors';
import * as Sizes from '../models/size';

const sizesRouter = require('express').Router();

sizesRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Sizes.getAllSizes().then(([result]) =>
        res.status(200).json(result)
      );
    } catch (err) {
      next(err);
    }
  }
);

sizesRouter.get(
  '/:idSize',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idSize } = req.params;
      Sizes.getSizeById(Number(idSize)).then((result) => {
        if (result) res.status(200).json(result);
        else
          res.status(404).send(`La taille avec id:${idSize} est introuvable.`);
      });
    } catch (err) {
      next(err);
    }
  }
);

sizesRouter.post(
  '/',
  Sizes.nameIsFree,
  Sizes.validateSize,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const size = req.body as ISize;
      size.id_size = await Sizes.createSize(size);
      res.status(201).json(size);
    } catch (err) {
      next(err);
    }
  }
);

<<<<<<< HEAD
sizesRouter.post('/', (req: Request, res: Response) => {
      const size: SizeInfo = req.body;
      let duplicateData = '';
      interface joiErrorsModel {
        details: Array<any>;
      }
      interface errModel {
        message: string;
      }
      let joiErrorsSize: joiErrorsModel;
      Promise.all([
        Sizes.findByNameSize(size.name),
      ])
        .then(([nameAllreadyExist]) => {
          if (nameAllreadyExist[0].length > 0) {
            duplicateData += 'Ce nom de taille existe déjà; ';
          }
          if (duplicateData) {
            return Promise.reject(duplicateData);
          }
          const joiErrorsSize = Sizes.validateSize(size, false);
          if (joiErrorsSize) {
            return Promise.reject('INVALID_DATA');
          }
          return Sizes.createSize(size)
        })
        .then(([createSize]: Array<any>) => {
          const id = createSize.insertId;
          res.status(201).json({ id, ...size })
        })
        .catch((error) => {
          if (error === duplicateData)
            res.status(409).json({ message: duplicateData });
          else if (error === 'INVALID_DATA') {
            const joiDetails: Array<string> = joiErrorsSize.details.map(
              (error: errModel) => {
                console.log(error);
                return error.message;
              })
            res.status(422).send(joiErrorsSize.details);
          } else res.status(500).send(error);
        });
      }
=======
sizesRouter.put(
  '/:idSize',
  Sizes.nameIsFree,
  Sizes.validateSize,
  async (req: Request, res: Response) => {
    const { idSize } = req.params;
    const { name, is_children } = req.body;
    const sizeUpdated = await Sizes.updateSize(
      Number(idSize),
      name,
      Number(is_children)
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37
    );
    if (sizeUpdated) {
      res.status(200).send('Taille mise à jour');
    } else {
<<<<<<< HEAD
      const size: SizeInfo = req.body;
      let duplicateData = '';
      interface joiErrorsModel {
        details: Array<any>;
      }
      interface errModel {
        message: string;
      }
      let joiErrorsSize: joiErrorsModel;
      Promise.all([
        Sizes.findByNameSize(size.name),
      ])
        .then(([nameAllreadyExist]) => {
          if (nameAllreadyExist[0].length > 0) {
            duplicateData += 'Ce nom de taille existe déjà; ';
          }
          if (duplicateData) {
            return Promise.reject(duplicateData);
          }
          const joiErrorsSize = Sizes.validateSize(size, false);
          if (joiErrorsSize) {
            return Promise.reject('INVALID_DATA');
          }
          return Sizes.updateSize(id, size)
        })
        .then(() => res.status(201).json( { ...sizeFound[0], ...size }))
        .catch((error) => {
          if (error === duplicateData)
            res.status(409).json({ message: duplicateData });
          else if (error === 'INVALID_DATA') {
            const joiDetails: Array<string> = joiErrorsSize.details.map(
              (error: errModel) => {
                console.log(error);
                return error.message;
              })
            res.status(422).send(joiErrorsSize.details);
          } else res.status(500).send(error);
        });
      }
    });
});

=======
      throw new ErrorHandler(500, `La taille n'a pas pu être mise à jour.`);
    }
  }
);
>>>>>>> b9f02dc91de0753f5ee582067c486f79cd977b37

sizesRouter.delete('/:idSize', (req: Request, res: Response) => {
  const { idSize } = req.params;
  Sizes.destroySize(Number(idSize)).then((result: Array<any>) => {
    if (result[0].affectedRows)
      res.status(201).json(`La taille avec l'id:${idSize} à était supprimé`);
    else res.status(404).json(`La taille avec l'id:${idSize} n'existe pas`);
  });
});

export default sizesRouter;
