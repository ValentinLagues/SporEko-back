// import { Request, Response } from 'express';
// const brandsRouter = require('express').Router();
// const Brands = require('../models/brand')

// interface BrandInfo {
//   name: string;
// }

// brandsRouter.get('/', (req: Request, res: Response) => {
//   Brands.findManyBrands().then(([result]:Array<any>) => {
//     res.status(200).json(result);
//   })
//   .catch((error : Array<any>) => { 
//     console.log(error); 
//   res.status(501).send('Error finding brands')
// })
// });

// brandsRouter.get('/:id', (req: Request, res: Response) => {
//   const { id } = req.params;
//   Brands.findOneBrand(id).then(([result]:Array<any>) => {
//     if ([result]) {
//       res.status(200).json([result]); }
//       else {
//   res.status(404).send('Brand not found')
// }})
// .catch((error: Array<any>) => {
//   console.log(error)
//   res.status(501).send('Error finding the brand');
// })
// });

// brandsRouter.post('/', (req: Request, res: Response) => {
//   const brand: BrandInfo = req.body;
//   const joiErrors = Brands.validateBrand(brand);
//   if (joiErrors) {
//     res.status(422).send(joiErrors.details);
//   } else {
//     Brands.createBrand(brand).then(([createdBrand]: Array<any>) => {

//       res.status(200).json(createdBrand);
//     })
//       .catch((error: Array<any>) => {
//         console.log(error)
//         res.status(501).send('Error creating the brand')
//       })
//   }
// });

// brandsRouter.put('/:id', (req: Request, res: Response) => { 
//   const { id } = req.params;
//   const { name } = req.body;
//   Brands.updateBrand(id, name).then(()=>res
//   .status(201).json(`Brand id:${id} successfully updated`))
//   .catch((error:Array<any>) => {
//     console.log(error)
//     res.status(501).send('Error updating a brand')
//   })
// });

// brandsRouter.delete('/:id', (req: Request, res: Response) => { 
//   const { id } = req.params;
//   Brands.destroyBrand(id)
//   .then((deleted : Array<any>) => {
//     if (deleted) res.status(201).json(`Brand id:${id} successfully deleted`);
//     else res.status(404).send('Brand not found')
// })
// .catch((error : Array<any>) => {
//   console.log(error);
//   res.status(501).send('Error deleting the brand')
// })
// });

// module.exports = { brandsRouter };

const brandsRouter = require('express').Router();
import { Request, Response } from 'express';
const Brands = require('../models/brand');

interface BrandInfo {
  name: string;
}

///////////// COLORS ///////////////

brandsRouter.get('/', (req: Request, res: Response) => {
  Brands.findManyBrands().then(([result]: Array<any>) => {
    res.status(200).json(result);
  });
});

brandsRouter.get('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  Brands.findOneBrand(idbrand).then(([result]: Array<any>) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send('Brand not found');
    }
  });
});

brandsRouter.post('/', (req: Request, res: Response) => {
  const brand: BrandInfo = req.body;
  const joiErrors = Brands.validateBrand(brand);
  if (joiErrors) {
    res.status(422).send(joiErrors.details);
  } else {
    Brands.createBrand(brand)
      .then(([createdBrand]: Array<any>) => {
        const id = createdBrand.insertId;
        res.status(201).json({ id, ...brand });
      })
      .catch((error: Array<any>) => {
        res.status(500).send(error);
      });
  }
});

brandsRouter.put('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  Brands.findOneBrand(idbrand).then(([brandFound]: Array<any>) => {
    if (brandFound.length > 0) {
      const brand: BrandInfo = req.body;
      const joiErrors = Brands.validateBrand(brand, false);
      if (joiErrors) {
        console.log('JoiErrors put brand');
        res.status(409).send(joiErrors.details);
      } else {
        Brands.updateBrand(idbrand, brand).then((updatedBrand: object) => {
          res.status(200).json({ brandFound, ...brand });
        });
      }
    } else {
      res.status(404).send('Color not found');
    }
  });
});

brandsRouter.delete('/:idbrand', (req: Request, res: Response) => {
  const { idbrand } = req.params;
  res.status(200).send('delete brand' + idbrand);
});

module.exports = { brandsRouter };