# cette branch est un tuto pour écrire du back -->
# je vais essayer de détailler chaque étape -->

# git clone, git checkout firstLocalConfig, npm install
# créez si c'est pas fait le .env avec VOS infos (cf fichier db-config si vous savez pas quoi écrire)
# mettez à jour votre bdd avec le reset-db (sur discord) en vous connectant sur terminal "mysql -u nomUtilisateur -p" puis mot de passe puis copiez-collez le reset-db dans le terminal
# npm run dev (nodemon)


# dans index.js à la racine -> mise en place des premiers packages, du .env, de la créations des dossiers du model mvc

# dans db-config, les détails sur le .env, voir où est utilisé "connection"

# dans routes/users.js y'a la base de la création des routes, requêtes etc pour la table users (faudra refaire la même chose pour chaque table). y'a pas encore la validation, l'authentification, y'a vraiment que la base de la communication entre postman, le back et la bdd

# dans routes/textiles.js y'a la validation avec joi

# prochaine étape pas encore écrite ... je sais pas encore :p

# hésitez pas à faire plein de tests en local mais ne pushez pas (sauf pour ajout de détails pour tuto -> créez un autre models et routes sur une autre table) 
