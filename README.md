# La bouffe en france 🇫🇷🥖🍷

Une application interactive pour découvrir les spécialités culinaires des départements français.

![Aperçu de l'application](https://via.placeholder.com/800x400?text=Aper%C3%A7u+de+l%27application)

## Fonctionnalités

- **Carte Interactive** : Une carte de France navigable (basée sur Leaflet) permettant de sélectionner chaque département.
- **Mode Quiz** : Testez vos connaissances ! La spécialité culinaire est initialement masquée. Cliquez sur "Voir la réponse" pour la révéler.
- **Feedback Visuel** :
  - Les départements cliqués s'affichent en **Rouge**.
  - Les départements non visités restent en **Vert**.
- **Données** : Les spécialités sont chargées dynamiquement à partir d'un fichier CSV.

## Technologies Utilisées

- **[Vite](https://vitejs.dev/)** : Build tool rapide pour le développement frontend.
- **[React](https://react.dev/)** : Bibliothèque JavaScript pour l'interface utilisateur.
- **[TypeScript](https://www.typescriptlang.org/)** : JavaScript typé pour un code plus robuste.
- **[Tailwind CSS](https://tailwindcss.com/)** : Framework CSS utilitaire pour le styling.
- **[React Leaflet](https://react-leaflet.js.org/)** : Composants React pour les cartes Leaflet.
- **[PapaParse](https://www.papaparse.com/)** : Parseur CSV puissant pour charger les données.

## Installation et Démarrage

1.  **Cloner le projet** :
    ```bash
    git clone <votre-repo-url>
    cd francerecettes
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

4.  **Ouvrir l'application** :
    Ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`).

## Structure du Projet

- `src/components/FranceMap.tsx` : Le composant principal gérant la carte, la logique du quiz et l'affichage des données.
- `public/specialties.csv` : La base de données des spécialités culinaires par département.
- `src/App.tsx` : Le point d'entrée de l'application.

## Auteur

Créé avec ❤️ par SamLePirate
