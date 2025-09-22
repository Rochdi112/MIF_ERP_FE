# 📊 Diagrammes à Générer - ERP MIF Maroc

## Vue d'ensemble du Système

Cette documentation liste tous les diagrammes qui doivent être générés pour documenter le système ERP de maintenance industrielle MIF Maroc. Le système est basé sur React/TypeScript avec une architecture modulaire et un système d'authentification multi-rôles.

---

## 🏗️ 1. DIAGRAMMES D'ARCHITECTURE SYSTÈME

### 1.1 Architecture Générale du Système
**Type**: Diagramme d'architecture système
**Description**: Vue d'ensemble de l'architecture frontend/backend
**Composants**:
- Frontend React/TypeScript/Vite
- Backend FastAPI (référencé)
- Base de données PostgreSQL (référencée)
- Système d'authentification JWT
- Stockage de documents (S3/MinIO référencé)
- API REST endpoints

### 1.2 Architecture Frontend - Structure des Composants
**Type**: Diagramme de composants
**Description**: Organisation des composants React et leur hiérarchie
**Composants**:
```
App.tsx (Racine)
├── AuthPage.tsx
├── AppLayout (Navigation + Sidebar)
│   ├── DashboardPage.tsx
│   ├── InterventionsPage.tsx
│   ├── PlanningPage.tsx
│   ├── EquipmentPage.tsx
│   ├── TechniciansPage.tsx
│   ├── UsersPage.tsx
│   ├── DocumentsPage.tsx
│   ├── ProfilePage.tsx
│   └── HelpPage.tsx
└── components/ui/ (Shadcn/ui components)
```

### 1.3 Architecture de Navigation
**Type**: Diagramme de flux de navigation
**Description**: Routes et navigation entre les pages selon les rôles
**Éléments**:
- Page de connexion
- Navigation basée sur les rôles
- Protection des routes
- Redirections automatiques

---

## 🔐 2. DIAGRAMMES D'AUTHENTIFICATION ET AUTORISATION

### 2.1 Système d'Authentification JWT
**Type**: Diagramme de séquence
**Description**: Processus de connexion et gestion des tokens
**Flux**:
1. Utilisateur saisit identifiants
2. Validation côté client
3. Envoi vers API `/auth/login`
4. Retour JWT token
5. Stockage en localStorage
6. Utilisation pour les requêtes suivantes

### 2.2 Matrix des Rôles et Permissions
**Type**: Diagramme matriciel
**Description**: Matrice des accès par rôle et module
**Rôles**:
- **Admin**: Accès complet à tous les modules
- **Responsable**: Interventions, Planning, Équipements, Techniciens, Documents
- **Technicien**: Interventions, Équipements (lecture), Documents
- **Client**: Tableau de bord uniquement

**Modules**:
- Tableau de bord: Tous
- Interventions: Admin, Responsable, Technicien
- Planification: Admin, Responsable
- Équipements: Admin, Responsable, Technicien (lecture)
- Techniciens: Admin, Responsable
- Utilisateurs: Admin uniquement
- Documents: Admin, Responsable, Technicien

### 2.3 Flux de Sécurité et Protection des Routes
**Type**: Diagramme de flux
**Description**: Mécanisme de protection des routes et vérification des permissions
**Processus**:
- Vérification du token
- Validation du rôle
- Autorisation d'accès
- Gestion des erreurs

---

## 📊 3. DIAGRAMMES DE MODÈLES DE DONNÉES

### 3.1 Modèle de Données - Interventions
**Type**: Diagramme entité-relation
**Description**: Structure des données pour les interventions
**Entités**:
```typescript
Intervention {
  id: string
  title: string
  description: string
  status: 'ouverte' | 'affectee' | 'en_cours' | 'en_attente' | 'cloturee' | 'annulee' | 'archivee'
  priority: 'low' | 'medium' | 'high'
  urgency: 'low' | 'medium' | 'high'
  type: 'corrective' | 'preventive'
  technician: string
  equipment: string
  created_date: string
  scheduled_date?: string
  completed_date?: string
  estimated_cost?: number
  actual_cost?: number
}
```

### 3.2 Modèle de Données - Équipements
**Type**: Diagramme entité-relation
**Description**: Structure des données pour les équipements
**Entités**:
```typescript
Equipment {
  id: string
  name: string
  description: string
  model?: string
  serial_number?: string
  manufacturer?: string
  installation_date?: string
  location: string
  status: 'operational' | 'maintenance' | 'breakdown' | 'decommissioned'
  last_maintenance?: string
  next_maintenance?: string
  total_interventions: number
}
```

### 3.3 Modèle de Données - Utilisateurs et Techniciens
**Type**: Diagramme entité-relation
**Description**: Structure des données pour les utilisateurs et techniciens
**Entités**:
```typescript
User {
  id: string
  username: string
  email: string
  name: string
  role: 'admin' | 'responsible' | 'technician' | 'client'
}

Technician {
  id: string
  name: string
  email: string
  phone: string
  specialization: string[]
  level: 'junior' | 'senior' | 'expert'
  status: 'available' | 'busy' | 'maintenance' | 'absent'
  interventions_count: number
  success_rate: number
}
```

### 3.4 Modèle de Données - Documents et Planning
**Type**: Diagramme entité-relation
**Description**: Structure des données pour les documents et planification
**Entités**:
```typescript
Document {
  id: string
  nom_fichier: string
  taille: number
  type: string
  intervention_id?: string
  date_upload: string
  uploaded_by: string
  status: 'pending' | 'validated' | 'rejected'
}

PlanningItem {
  id: string
  title: string
  equipment_id: string
  type: 'preventive' | 'inspection' | 'calibration'
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  next_date: string
  assigned_technician?: string
  status: 'active' | 'inactive'
}
```

---

## 🔄 4. DIAGRAMMES DE WORKFLOWS MÉTIER

### 4.1 Workflow Complet des Interventions
**Type**: Diagramme de processus (BPMN-style)
**Description**: Cycle de vie complet d'une intervention
**Étapes**:
1. **Création** (Ouverte)
   - Détection du problème
   - Création de l'intervention
   - Évaluation de la priorité/urgence

2. **Affectation** (Affectée)
   - Assignation à un technicien
   - Planification
   - Préparation des ressources

3. **Exécution** (En cours)
   - Début de l'intervention
   - Suivi en temps réel
   - Possibilité de mise en attente

4. **Clôture** (Terminée/Clôturée)
   - Validation des travaux
   - Mise à jour des coûts
   - Documentation

5. **États alternatifs** (Annulée/Archivée)
   - Conditions d'annulation
   - Processus d'archivage

### 4.2 Workflow de Maintenance Préventive
**Type**: Diagramme de processus
**Description**: Processus de planification et exécution de la maintenance préventive
**Étapes**:
1. Définition des fréquences
2. Programmation automatique
3. Génération des interventions
4. Notification des techniciens
5. Exécution et suivi
6. Mise à jour du planning

### 4.3 Workflow de Gestion des Documents
**Type**: Diagramme de processus
**Description**: Processus d'upload, validation et gestion des documents
**Étapes**:
1. Upload par glisser-déposer
2. Validation du type/taille
3. Association à une intervention
4. Stockage sécurisé
5. Accès et téléchargement
6. Suivi des versions

### 4.4 Workflow d'Escalade et Notifications
**Type**: Diagramme de flux
**Description**: Système d'escalade automatique et notifications
**Conditions**:
- Interventions en retard
- Équipements en panne critique
- Maintenance préventive due
- Validations requises

---

## 💻 5. DIAGRAMMES D'INTERFACE UTILISATEUR

### 5.1 Plan du Site (Sitemap)
**Type**: Diagramme hiérarchique
**Description**: Structure complète de navigation du site
**Hiérarchie**:
```
Accueil (Connexion)
├── Tableau de bord (Tous)
├── Interventions (Admin, Responsable, Technicien)
│   ├── Liste des interventions
│   ├── Détail d'intervention
│   │   ├── Onglet Général
│   │   ├── Onglet Historique
│   │   └── Onglet Documents
│   └── Création/Modification
├── Planification (Admin, Responsable)
│   ├── Vue Liste
│   └── Vue Calendrier
├── Équipements (Admin, Responsable, Technicien)
│   ├── Inventaire
│   ├── Détail équipement
│   └── Historique maintenance
├── Techniciens (Admin, Responsable)
│   ├── Liste des techniciens
│   ├── Profil technicien
│   └── Statistiques
├── Utilisateurs (Admin)
│   ├── Gestion des comptes
│   └── Attribution des rôles
├── Documents (Admin, Responsable, Technicien)
│   ├── Bibliothèque
│   ├── Upload
│   └── Associations
├── Profil (Tous)
└── Aide (Tous)
```

### 5.2 Parcours Utilisateur par Rôle
**Type**: Diagrammes de user journey
**Description**: Parcours typiques pour chaque type d'utilisateur

**Parcours Admin**:
1. Connexion → Tableau de bord
2. Vue d'ensemble des KPIs
3. Gestion des utilisateurs
4. Supervision des interventions
5. Configuration du système

**Parcours Responsable**:
1. Connexion → Tableau de bord
2. Planification des maintenances
3. Assignation des interventions
4. Suivi des techniciens
5. Validation des travaux

**Parcours Technicien**:
1. Connexion → Interventions assignées
2. Consultation des détails
3. Mise à jour du statut
4. Upload de documents
5. Clôture d'intervention

**Parcours Client**:
1. Connexion → Tableau de bord
2. Consultation des KPIs
3. Vue des interventions en cours
4. Suivi des équipements

### 5.3 Wireframes des Interfaces Principales
**Type**: Diagrammes de wireframes
**Description**: Structure des interfaces clés

**Tableau de bord**:
- KPIs en cards
- Graphiques de tendances
- Liste des interventions récentes
- Actions rapides

**Page Interventions**:
- Filtres avancés
- Tableau avec statuts
- Actions par ligne
- Modal de détail avec onglets

**Planification**:
- Switch Vue Liste/Calendrier
- Filtres par type/technicien
- Modal de création
- Indicateurs visuels

---

## 📊 6. DIAGRAMMES DE DONNÉES ET ANALYTICS

### 6.1 Dashboard KPIs et Métriques
**Type**: Diagramme de dashboard
**Description**: Métriques et indicateurs clés affichés
**KPIs**:
- Interventions ouvertes/terminées
- Temps moyen de résolution
- Taux de réussite des maintenances
- Disponibilité des équipements
- Performance des techniciens
- Coûts de maintenance

### 6.2 Graphiques et Visualisations
**Type**: Spécification des graphiques (avec Recharts)
**Description**: Types de graphiques utilisés dans le système
**Graphiques**:
- **Graphique en barres**: Interventions par mois (correctives vs préventives)
- **Graphique linéaire**: Évolution des coûts de maintenance
- **Graphique en secteurs**: Répartition des interventions par statut
- **Graphique de progression**: Taux de réalisation des maintenances
- **Heatmap**: Disponibilité des équipements par période

### 6.3 Rapports et Exports
**Type**: Diagramme de processus
**Description**: Système de génération de rapports
**Types de rapports**:
- Rapport mensuel des interventions
- Rapport de performance des techniciens
- Rapport de maintenance préventive
- Rapport de coûts par équipement
- Rapport de disponibilité

---

## 🔄 7. DIAGRAMMES D'INTÉGRATION ET API

### 7.1 Architecture API REST
**Type**: Diagramme d'API
**Description**: Endpoints et structure des APIs
**Endpoints principaux**:
```
Auth:
- POST /auth/login
- POST /auth/refresh
- GET /auth/me

Interventions:
- GET /interventions
- POST /interventions
- GET /interventions/{id}
- PUT /interventions/{id}
- DELETE /interventions/{id}

Équipements:
- GET /equipments
- POST /equipments
- GET /equipments/{id}
- PUT /equipments/{id}

Documents:
- GET /documents
- POST /documents/upload
- GET /documents/{id}/download
- DELETE /documents/{id}
```

### 7.2 Flux de Données Frontend-Backend
**Type**: Diagramme de séquence
**Description**: Communication entre le frontend et le backend
**Interactions**:
1. Authentification et récupération du token
2. Requêtes CRUD avec autorisation
3. Gestion des erreurs et retry
4. Synchronisation des données en temps réel

### 7.3 Gestion d'État Frontend
**Type**: Diagramme d'état
**Description**: Gestion de l'état global avec React Context
**États globaux**:
- AuthContext (utilisateur, token, permissions)
- ThemeContext (mode sombre/clair)
- NotificationContext (notifications système)
- Données locales par composant (useState)

---

## 🔒 8. DIAGRAMMES DE SÉCURITÉ

### 8.1 Architecture de Sécurité
**Type**: Diagramme de sécurité
**Description**: Mesures de sécurité implémentées
**Composants**:
- Authentification JWT
- Protection CSRF
- Validation des entrées
- Chiffrement des données sensibles
- Audit trail
- Rate limiting

### 8.2 Flux de Validation et Sanitisation
**Type**: Diagramme de flux
**Description**: Processus de validation des données
**Étapes**:
1. Validation côté client (React Hook Form)
2. Sanitisation des entrées
3. Validation côté serveur
4. Protection contre XSS/SQL injection
5. Logging des tentatives malveillantes

---

## 🚀 9. DIAGRAMMES DE DÉPLOIEMENT

### 9.1 Architecture de Déploiement
**Type**: Diagramme de déploiement
**Description**: Infrastructure de production
**Composants**:
- Frontend: Serveur Nginx
- Backend: Conteneurs Docker
- Base de données: PostgreSQL
- Stockage: S3/MinIO
- Monitoring: Prometheus/Grafana
- Load Balancer
- SSL/TLS

### 9.2 Pipeline CI/CD
**Type**: Diagramme de pipeline
**Description**: Processus d'intégration et déploiement continu
**Étapes**:
1. Commit/Push sur GitHub
2. Tests automatisés
3. Build des artefacts
4. Déploiement staging
5. Tests d'intégration
6. Déploiement production
7. Monitoring et alertes

---

## 📱 10. DIAGRAMMES RESPONSIVE ET MOBILE

### 10.1 Design Responsive
**Type**: Diagrammes de breakpoints
**Description**: Adaptation aux différentes tailles d'écran
**Breakpoints**:
- Mobile: 320px-767px
- Tablet: 768px-1023px
- Desktop: 1024px-1439px
- Large: 1440px+

### 10.2 Navigation Mobile
**Type**: Diagramme d'interface mobile
**Description**: Adaptation de la navigation pour mobile
**Éléments**:
- Menu hamburger
- Sidebar collapsible
- Navigation par onglets
- Actions flottantes
- Gestures touch

---

## 🎨 11. DIAGRAMMES DE DESIGN SYSTEM

### 11.1 Palette de Couleurs
**Type**: Guide de couleurs
**Description**: Système de couleurs utilisé
**Couleurs**:
- Primary: Indigo (#4F46E5)
- Secondary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray (#6B7280)

### 11.2 Composants UI (Shadcn/ui)
**Type**: Library de composants
**Description**: Catalogue des composants réutilisables
**Composants**:
- Buttons (Primary, Secondary, Tertiary)
- Forms (Input, Select, Textarea, Checkbox)
- Navigation (Sidebar, Breadcrumb, Tabs)
- Feedback (Toast, Alert, Badge, Progress)
- Overlay (Dialog, Popover, Dropdown)
- Data Display (Table, Card, Calendar)

---

## 📋 12. DOCUMENTATION COMPLÉMENTAIRE

### 12.1 Diagrammes de Tests
**Type**: Diagramme de stratégie de tests
**Description**: Approche de test du système
**Types de tests**:
- Tests unitaires (composants React)
- Tests d'intégration (API)
- Tests E2E (Playwright)
- Tests de performance
- Tests de sécurité

### 12.2 Diagrammes de Monitoring
**Type**: Diagramme de monitoring
**Description**: Surveillance du système en production
**Métriques**:
- Performance de l'application
- Erreurs JavaScript
- Temps de réponse API
- Utilisation des ressources
- Satisfaction utilisateur

---

## ✅ PRIORITÉS DE GÉNÉRATION

### Priorité Haute (À générer en premier)
1. Architecture Générale du Système
2. Workflow Complet des Interventions  
3. Matrix des Rôles et Permissions
4. Plan du Site (Sitemap)
5. Modèle de Données - Interventions

### Priorité Moyenne
6. Architecture Frontend - Structure des Composants
7. Workflow de Maintenance Préventive
8. Dashboard KPIs et Métriques
9. Parcours Utilisateur par Rôle
10. Architecture API REST

### Priorité Basse
11. Tous les autres diagrammes selon les besoins

---

## 🛠️ OUTILS RECOMMANDÉS POUR LA GÉNÉRATION

- **Diagrammes d'architecture**: Draw.io, Lucidchart, Mermaid
- **Workflows/Processus**: Figma, Draw.io, BPMN.io
- **Modèles de données**: DbDiagram.io, ERDPlus
- **UI/UX**: Figma, Sketch, Adobe XD
- **Diagrammes techniques**: Mermaid, PlantUML
- **Monitoring**: Grafana, Kibana

---

**💡 Note**: Ce document constitue une feuille de route complète pour la documentation visuelle du système ERP MIF Maroc. Chaque diagramme peut être généré individuellement selon les besoins et les priorités du projet.