const textilesRouter = require('express').Router();
const Textile = require('../models/textile');

//GET '/' all
textilesRouter.get('/', (req, res) => {
  Textile.findMany()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving textiles from database');
    });
});

//GET '/:id'
textilesRouter.get('/:id', (req, res) => { 
  Textile.findOne(req.params.id)
    .then((textile) => {
      if (textile) res.json(textile);
      else res.status(404).send('Textile not found');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving textile from database');
    });
});

//POST
textilesRouter.post("/", (req, res) => {
  const validationErrors = Textile.validate(req.body);
  if (validationErrors) {
    res.status(422).json({ validationErrors });
  } else {
    Textile.create(req.body)
      .then((createdTextile) => {
        res.status(201).json(createdTextile);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// PUT '/:id' 
textilesRouter.put("/:id", (req, res) => {
  Textile.findOne(req.params.id)
    .then((textileFound) => {
      if (textileFound) {
        Textile.update(req.params.id, req.body)
        .then(() => {
          res.status(200).json({ ...textileFound, ...req.body });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("probleme dans la modif ce textile");
        });
      } else res.status(404).send('Textile not found');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Erreuuuur");
    });
});

//DELETE '/:id'
textilesRouter.delete("/:id", (req, res) => {
  Textile.destroy(req.params.id)
  .then((deleted) => {
    if (deleted) res.status(200).send("🎉 Textile deleted!");
    else res.status(404).send("Textile not found");
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error deleting a textile");
  });
});

module.exports = textilesRouter;
