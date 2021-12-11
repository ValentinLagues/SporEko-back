//on est dans le fichier routes/users donc on agit que sur les users -> faudra créer des fichiers pour chaque table (dans routes et dans models)

// on a initialisé une route users dans routes/index, on lui a donné la base '/users' pour dire que userRouter =
//en local http://localhost:8000/users
//en distant https://HOST:PORT/users (je suppose)
const usersRouter = require('express').Router();

//on importe les fonctions qui sont dans models/user, on les stock dans la const User pour pouvoir faire User.nomDeLaFonctionVoulue
const User = require('../models/user');



//GET '/' pour récup tous les users (plus tard y'aura tous les filtres en plus ^^)
usersRouter.get('/', (req, res) => {
  User.findMany()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving users from database');
    });
});

//GET '/:id' pour récup un seul user par son id (est-ce qu'il faudra créer des routes get/:lastname, get/:firstname email etc? je sais pas)
usersRouter.get('/:id', (req, res) => { 
  User.findOne(req.params.id)
    .then((user) => {
      if (user) res.json(user);
      else res.status(404).send('User not found');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving user from database');
    });
});

//POST pour créer un nouveau user
usersRouter.post("/", (req, res) => {
  //vérif infos ok -> joi / + pas de double? cf client (qu'est-ce qui doit être unique? bref plein de trucs à rajouter... puis)
  User.create(req.body)
  .then((createdUser) => {
    res.status(201).json(createdUser);
  })
  .catch((err) => {
    console.error(err);
  });
});

// PUT '/:id' pour modifier un user existant en le retrouvant par son id (même question que pour get /:id)
usersRouter.put("/:id", (req, res) => {
  // d'abords, on récup l'id depuis req.params.id pour aller chercher le user correspondant dans la bdd avec la fonction findOne qui est dans models/user
  User.findOne(req.params.id)
    .then((userFound) => {
      if (userFound) {
        //si on entre dans le if, ça veut dire que l'id qu'on veut modifier existe en bdd sinon on serait dans le else (la bdd renvoit un tableau vide si on lui envoit un id qui n'existe pas dans la bdd... et tableau vide équivaut à false apparement)
        //donc l'id existe -> on peut lancer la procédure de modif avec la fonction update dans model/user
        User.update(req.params.id, req.body)
        .then(() => {
          //si on entre dans le .then, ça veut dire que la modif a bien été effectuée en bdd sinon on serait dans le .catch
          res.status(200).json({ ...userFound, ...req.body });
        })
        .catch((err) => {
          //ici faudra coder les retours erreur pour savoir ce qui va pas
          //pour l'instant, je peux mettre false ou un nombre dans le champ lastname... ça transforme tout en string, je m'y attendais pas (sera résolu par joi probablement)
          console.log(err);
          res.status(500).send("probleme dans la modif ce user");
        });
      } else res.status(404).send('User not found');
    })
    .catch((err) => {
      //ici je crois que c'est plus une erreur de connection à la bdd genre nodemon a crash ou le.env a pas les bonne infos etc
      console.log(err);
      res.status(500).send("Erreuuuur");
    });
});

//DELETE '/:id' pour supprimer un user en le trouvant par son id
usersRouter.delete("/:id", (req, res) => {
  //le delete depuis le compte utilisateur sera un changement de statut -> archivé
  //pas de route delete sauf dans admin?
  //je la code quand même au cas où
  User.destroy(req.params.id)
  .then((deleted) => {
    if (deleted) res.status(200).send("🎉 User deleted!");
    else res.status(404).send("User not found");
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error deleting a user");
  });
});

module.exports = usersRouter;
