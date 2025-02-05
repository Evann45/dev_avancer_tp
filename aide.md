## Prérequis
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm use 22
nvm alias default 22
corepack enable pnpm
corepack use pnpm@8
pnpm install


## Lancer la doc swagger
pnpm run docs:swagger:start

## Lancer le client app
pnpm run apps:client:dev

## Lancer le serveur player
npm run apps:server:dev


## Controller player
https://dev.to/souhailxedits/getting-started-with-nestjs-and-typeorm-a-beginners-guide-ggc

npm install -g @nestjs/cli
npm install @nestjs/typeorm typeorm sqlite3

nest generate module users
nest generate service users


## Ajouter des joueur
curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Yannis",
    "rank" :2
}'

curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Yannis",
    "rank" :3
}'

curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Evann",
    "rank" :4
}'
curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Loann",
    "rank" :5
}'
curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Jordan",
    "rank" :6
}'
curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{
    "id" : "Khalil",
    "rank" :99
}'
curl --location 'http://localhost:3000/api/player' --header 'Content-Type: application/json' --data '{
    "id" : "Yannis",
    "rank" :99
}'


## Voir les joueurs
curl localhost:3000/api/ranking

## Event immiter
npm i --save @nestjs/event-emitter

## Commande pour générer tout l'arborescence d'un module
nest generate resource <nom>

## Mettre a jour corepack
corepack prepare --activate