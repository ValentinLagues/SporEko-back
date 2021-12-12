// pour initialiser express, il faut l'avoir installé :p
// puis const express = require('express');
// et const app = express();
const express = require('express');

// model mvc donc on crée un dossier routes dans lequel on crée un fichier index.js, et un dossier models
// cf routes/index.js à chaque fois qu'on veut écrire du back pour une nouvelle table , il faudra créer une nouvelle base de route

// ici on importe la totalité des routes crées dans routes/index.js avec const { setupRoutes } = require("./routes");  
// puis on dit setupRoutes(app);
const { setupRoutes } = require("./routes");

const app = express();

// définition du port -> on dit à l'ordi: va voir dans .env, si y'a pas, c'est 8000 (si j'ai bien suivi, une fois hébergé, le process.env fera référence à ovh, mais je sais pas comment)
// pour le .env, j'ai mis des détails dans db-config
// 8000 est arbitraire on peut changer de chiffre (aucune idée si on peut mettre tout ce qu'on veut ou pas... mais ATTENTION à ne pas mettre le même que pour le front qui est (en général ? ou toujours ?) 3000)
const port = process.env.PORT || 8000;

// ne pas oublier le .json je crois que c'est pour que toutes les réponses de la bdd soient converties en json mais j'en suis pas sure
app.use(express.json());
setupRoutes(app);


// ne pas oublier le .listen sinon ça marche pas :p
// pour postman, l'url à laquelle faire les requêtes sera http://localhost:${port}/votreRoute ... votreRoute c'est ce qu'il y a dans routes/index.js par exemple pour tester la route users, c'est http://localhost:8000/users pour moi
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
