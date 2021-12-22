import { Request, Response } from 'express';
const sizesRouter = require('express').Router();
const Sizes = require('../models/size')

interface SizeInfo {
  name: string;
  is_children: number;
}

sizesRouter.get('/', (req: Request, res: Response) => {
  Sizes.findManySizes().then(([result]: Array<any>) => {
    res.status(200).json(result);
  }).catch((err: Error) => {
    console.log(err)
    res.status(500).send('Erreur impossible de trouvé genders dans la base de donnée');
  });
});

sizesRouter.get('/:id', (req: Request, res: Response) => {

  const { id } = req.params;
  Sizes.findOneSize(id).
    then(([result]: Array<any>) => {
      if (result[0]) res.status(200).json(result[0]);
      else res.status(404).json(`Size id:${id} n'existe pas dans la base de données`)
    }).catch((err: Error) => {
      console.log(err)
      res.status(500).send('Erreur impossible de trouvé size dans la base de donnée');
    });
});

sizesRouter.post('/', (req: Request, res: Response) => {
      const size: SizeInfo = req.body;
      let duplicateData: string = '';
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
    );



sizesRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  Sizes.findOneSize(id).then(([sizeFound]: Array<any>) => {
    if (sizeFound.length < 1) {
      res.status(404).send('Taille non trouvé');
    } else {
      const size: SizeInfo = req.body;
      let duplicateData: string = '';
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



sizesRouter.delete('/:id', (req: Request, res: Response) => { 
  const { id } = req.params;
  Sizes.destroySize(id).then((result: Array<any>) => {
    if (result[0].affectedRows) res.status(201).json(`Size id:${id} supprimé`)
    else res.status(404).json(`Size id:${id} n'existe pas`)
  })
});

module.exports = { sizesRouter };