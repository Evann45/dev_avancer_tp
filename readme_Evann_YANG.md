# REALTIME-ELO-RANKER

Ce projet implémente un système de classement en temps réel des joueurs basé sur le système ELO, en utilisant NestJS, TypeORM et SQLite3 pour la gestion des joueurs et des matchs.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils nécessaires :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm use 22
nvm alias default 22
corepack enable
pnpm corepack use pnpm@8
pnpm install
```

## Lancer l'application

### Lancer la documentation Swagger

```bash
pnpm run docs:swagger:start
```

### Lancer le serveur player

```bash
pnpm run apps:server:dev
```

### Lancer le client (si le serveur est lancé)

```bash
npm run apps:server:dev
```

## Mise en place du Controller Player

Le projet utilise NestJS avec TypeORM pour gérer les joueurs et leurs classements.

### Installation des dépendances nécessaires

```bash
npm install -g @nestjs/cli
npm install @nestjs/typeorm typeorm sqlite3
```

### Génération du module et du service pour les joueurs

```bash
nest generate module users
nest generate service users
```

## Gestion des joueurs

### Ajouter des joueurs

Utilisez `curl` pour ajouter des joueurs :

```bash
curl --location 'http://localhost:3000/player' --header 'Content-Type: application/json' --data '{ "id" : "Yannis", "rank" : 2 }'
curl --location 'http://localhost:3000/api/player' --header 'Content-Type: application/json' --data '{ "id" : "Kévin", "rank" : 99 }'
```

### Voir les joueurs

Pour afficher les joueurs et leur classement, envoyez une requête GET :

```bash
curl localhost:3000/api/ranking
```

## EventEmitter

Pour implémenter les événements dans l'application, installez la dépendance suivante :

```bash
npm i --save @nestjs/event-emitter
```

### Générer un module

```bash
nest generate resource <nom>
```

## Gestion des dépendances

### Mise à jour de Corepack

```bash
corepack prepare --activate
```

### Problème de dépendance

Si vous rencontrez des problèmes de dépendances, exécutez la commande suivante :

```bash
pnpm install -w @nestjs/typeorm
```

## Tests

### Tests unitaires

#### Installation des dépendances pour les tests

```bash
npm i --save-dev @nestjs/testing
npm install --save-dev jest @types/jest ts-jest
```

#### Exécution des tests unitaires

```bash
npm run test
```

### Tests E2E

#### Installation de Supertest pour les tests End-to-End

```bash
npm install --save-dev supertest
```

#### Création des tests E2E

Ajout des tests E2E en suivant les bonnes pratiques de test.

## Particularités du projet

- **Structure modulaire** : Le projet est organisé en modules pour une meilleure maintenabilité.
- **Callbacks vs async/await** : Les fonctions ont été implémentées avec des callbacks plutôt qu'avec async/await, selon les recommandations de NestJS.
- **Gestion des dépendances** : Les dépendances sont soigneusement gérées pour éviter les conflits.
- **Base de données SQLite3** : SQLite3 est utilisé pour gérer les données des joueurs et des matchs.

