# Checklist Frontend Vite/React ERP

## Structure & Architecture
- [ ] Vérifier la structure des dossiers : `src/`, `components/`, `guidelines/`, `lib/`, `styles/`, `build/`
- [ ] Fichier principal : `main.tsx`, `App.tsx`
- [ ] Fichiers de configuration : `vite.config.ts`, `tsconfig.json`, `package.json`, `README.md`

## Composants & UI
- [ ] Organisation des composants réutilisables dans `components/`
- [ ] Guidelines et documentation UI : `guidelines/`, `Attributions.md`, `GUIDE_NAVIGATION.md`
- [ ] Styles CSS : `styles/`, `index.css`

## Navigation
- [ ] Vérifier la navigation entre les pages (React Router ou équivalent)
- [ ] Structure des routes et accès sécurisé

## Intégration API
- [ ] Appels API vers le backend FastAPI
- [ ] Gestion des erreurs et loading states
- [ ] Typage des données (TypeScript)
- [ ] Respect du contrat d'API (`frontend_contract.json`)

## Authentification & Sécurité
- [ ] Gestion de l'authentification utilisateur
- [ ] Stockage sécurisé des tokens (localStorage, cookies, etc.)
- [ ] Protection des routes privées

## Tests
- [ ] Présence de tests unitaires et d'intégration
- [ ] Couverture de tests

## Build & Déploiement
- [ ] Vérifier la génération du build dans `build/`
- [ ] Configuration du déploiement (Nginx, Docker, etc.)

## Points à valider
- [ ] Respect des bonnes pratiques React/Vite
- [ ] Typage strict TypeScript
- [ ] Documentation technique à jour
- [ ] Accessibilité et responsive design
