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
  > **Note** : Les données de spécialités dans le fichier CSV sont actuellement générées par une IA et peuvent nécessiter des corrections.

## Technologies Utilisées

- **[Vite](https://vitejs.dev/)** : Build tool rapide pour le développement frontend.
- **[React](https://react.dev/)** : Bibliothèque JavaScript pour l'interface utilisateur.
- **[TypeScript](https://www.typescriptlang.org/)** : JavaScript typé pour un code plus robuste.
- **[Tailwind CSS](https://tailwindcss.com/)** : Framework CSS utilitaire pour le styling.
- **[React Leaflet](https://react-leaflet.js.org/)** : Composants React pour les cartes Leaflet.
- **[PapaParse](https://www.papaparse.com/)** : Parseur CSV puissant pour charger les données.

## Guide pour Débutants

Si vous n'êtes pas familier avec le développement web, suivez ces étapes simples pour commencer.

### 1. Installer Node.js

Pour faire fonctionner cette application, vous avez besoin de **Node.js** installé sur votre ordinateur.

-   **Windows** :
    1.  Allez sur le site officiel : [nodejs.org](https://nodejs.org/).
    2.  Téléchargez la version **LTS** (Long Term Support) recommandée pour la plupart des utilisateurs.
    3.  Lancez l'installateur et suivez les instructions (cliquez sur "Suivant" jusqu'à la fin).

-   **macOS** :
    1.  Allez sur [nodejs.org](https://nodejs.org/) et téléchargez la version **LTS**.
    2.  Ou, si vous utilisez Homebrew, ouvrez le terminal et tapez : `brew install node`.

-   **Linux** :
    -   Utilisez le gestionnaire de paquets de votre distribution (ex: `sudo apt install nodejs npm` pour Ubuntu/Debian).

Pour vérifier que l'installation a réussi, ouvrez un terminal (ou Invite de commandes sur Windows) et tapez `node -v`. Vous devriez voir un numéro de version s'afficher.

### 2. Télécharger et Lancer l'Application

Une fois Node.js installé :

1.  **Télécharger le code** :
    -   Cliquez sur ce lien pour télécharger le projet : [Télécharger le ZIP](https://github.com/TheSamLePirate/FranceRecette/archive/refs/heads/main.zip).
    -   Décompressez le fichier ZIP (clic droit > Extraire tout ou double-clic).

2.  **Ouvrir le Terminal** :
    -   **Windows** : Cherchez "PowerShell" ou "Invite de commandes" dans le menu Démarrer.
    -   **macOS** : Cherchez "Terminal" avec Spotlight (Cmd + Espace).

3.  **Aller dans le dossier du projet** :
    Tapez `cd` suivi d'un espace, puis glissez-déposez le dossier décompressé (`FranceRecette-main`) dans la fenêtre du terminal. Cela écrira le chemin automatiquement.
    Appuyez sur **Entrée**.
    *(Exemple : `cd /Users/moi/Downloads/FranceRecette-main`)*

4.  **Installer et Lancer** :
    Tapez les commandes suivantes (appuyez sur Entrée après chaque ligne) :
    ```bash
    npm install
    npm run dev
    ```

5.  **Ouvrir l'application** :
    Une fois que le terminal affiche une adresse comme `http://localhost:5173/`, ouvrez votre navigateur web et allez à cette adresse.

### 3. Modifier les Spécialités Culinaires

Vous pouvez changer les plats affichés sur la carte sans toucher au code !

1.  Allez dans le dossier `public` du projet.
2.  Ouvrez le fichier `specialties.csv`.
3.  Vous pouvez l'ouvrir avec :
    -   Un éditeur de texte (Bloc-notes, TextEdit, VS Code).
    -   Excel ou Google Sheets.

**⚠️ IMPORTANT : Format du fichier**
Assurez-vous que le fichier reste au format **CSV** (séparé par des virgules). Si vous utilisez Excel, faites "Enregistrer sous" et choisissez "CSV (séparateur: point-virgule ou virgule)".

Le fichier doit ressembler à ceci :
```csv
code,department,specialty
01,Ain,Poulet de Bresse
02,Aisne,Ficelle Picarde
...
```
Pour changer une spécialité, remplacez simplement le texte après la dernière virgule de la ligne correspondante.

## Installation et Démarrage

1.  **Cloner le projet** :
    ```bash
    git clone https://github.com/TheSamLePirate/FranceRecette.git
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

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
