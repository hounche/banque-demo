# Banque Demo - Monorepo (client + server)

Ce dépôt contient une application mobile React Native (Expo) et une API Express minimale pour remplacer le mock.

Structure:
- client/ : application Expo React Native (TypeScript) utilisant React Native Paper pour l'UI
- server/ : API Express minimale (in-memory) exposant endpoints /login, /accounts, /accounts/:id/transactions, /transfer

Comment lancer en local (développement):

1) Lancer le server:
   cd server
   npm install
   npm start
   (Le serveur écoute sur http://localhost:3000)

2) Lancer l'app Expo:
   cd client
   npm install
   npm start
   - Sur émulateur Android utilisez http://10.0.2.2:3000 comme baseURL si nécessaire.

Tests server:
   cd server
   npm test

Remarques:
- C'est un exemple didactique. Ne pas utiliser tel quel en production.
- Pour utiliser l'app sur un appareil réel, remplacez la baseURL dans client/src/services/api.ts par l'IP de votre machine.
