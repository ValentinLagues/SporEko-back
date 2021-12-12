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

  console.log(req.body)

  //verif joi avant fonction create:
  // on appelle la fonction "validate" créer dans models/textile dans laquelle on a mis tous les champs à vérifier, leur type, leur taille, si ils sont obligatoires, si ils doivents respecter un certain format (regex) etc ...
  // ET QUI NE RENVOIT QUE LES ERREURS parce que y'a un .error à la fin (on pourrait faire autrement... du coup attention à pas l'oublier dans la fonction validate)
  const erreursTrouveesParJoi = Textile.validate(req.body);
  console.log("rep joi : " + erreursTrouveesParJoi) // si y'a pas d'erreurs -> erreursTrouveesParJoi est undefined -> si vous avez du mal à comprendre, faites des tests:
  // tester : 
  // * avoir fait le npm install (vérifier que joi est bien la package.json)
  // * la bdd est à jour (le reset-bdd est sur le discord)
  // * npm run dev ou nodemon ... bref le back est allumé
  // * depuis postman -> en post vers http://localhost:8000/textiles (pour moi le port c'est 8000, voyez pour le votre), envoyer un objet {"name": "Métal"} par exemple
  // si vous avez rien changé, normalement c'est ok (Métal est entré dans la table textiles , la réponse dans postman est le nouvel objet crée)
  // * changez le max pour 2 (au lieu de 255) dans models/textile dans la fonction validate
  // * relancez la requête depuis postman

  if (erreursTrouveesParJoi) {
    // on rentre dans ce if parce que erreursTrouveesParJoi n'EST PAS undefined -> on revoit les erreurs trouvées. aucune idée de comment les traiter pour les afficher dans le front :p
    // ça empêche de créer le nouvel enregistrement
    res.status(422).json({ erreursTrouveesParJoi });
  } else {
    // si on rentre dans ce else, c'est que y'avait pas d'erreur donc on crée l'enregistrement dnas la table textiles
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
