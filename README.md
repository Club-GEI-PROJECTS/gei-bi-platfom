# 🏗️ Plateforme BI - Club GEI

Système de Business Intelligence complet simulant la collecte et l'analyse de données de ventes pour une entreprise de matériaux de construction en RDC.

## 📋 Architecture

```
Simulateur Python (24/7)
        ↓ API REST
Back-end NestJS (BI Data Collector)
        ↓
PostgreSQL (Docker local)
        ↓
Power BI (DirectQuery)
        ↓
Dashboard BI Temps réel
```

## 🚀 Technologies

- **Backend**: NestJS + TypeORM
- **Base de données**: PostgreSQL (Docker local)
- **Simulateur**: Python 3
- **Visualisation**: Power BI
- **Conteneurisation**: Docker & Docker Compose

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Python 3.8+
- Docker et Docker Compose (pour PostgreSQL local)
- Power BI Desktop (optionnel pour la visualisation)

### 1. Démarrer PostgreSQL avec Docker

```bash
# Démarrer PostgreSQL et pgAdmin
docker-compose up -d

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps
```

### 2. Configuration du Backend

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp env.example .env

# Le fichier .env est déjà configuré pour Docker local
# DIRECT_URL=postgresql://postgres:postgres@localhost:5432/gei_bi_platform
```

Voir `DOCKER_SETUP.md` pour plus de détails.

### 3. Peupler la base de données (Seed)

```bash
# Exécuter le script de seed pour créer toutes les provinces, villes et produits
npm run seed

# Ce script crée :
# - 26 provinces de la RDC
# - 24 communes de Kinshasa
# - 100+ villes à travers la RDC
# - 80+ produits de matériaux de construction
```

Voir `SEED_INSTRUCTIONS.md` pour plus de détails.

### 4. Démarrer le serveur NestJS

```bash
# Mode développement (avec hot-reload)
npm run start:dev

# Le serveur démarre sur http://localhost:3000
```

### 5. Configuration du Simulateur Python

```bash
# Aller dans le dossier simulateur
cd simulator

# Installer les dépendances
pip install -r requirements.txt

# Lancer le simulateur
python sales_simulator.py
```

Le simulateur va générer des ventes aléatoires en continu et les envoyer à l'API.

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints disponibles

#### Sales (Ventes)
- `POST /api/sales` - Crée une nouvelle vente
- `GET /api/sales` - Liste toutes les ventes
- `GET /api/sales/stats` - Statistiques globales

#### Customers (Clients)
- `POST /api/customers` - Crée un nouveau client
- `GET /api/customers` - Liste tous les clients
- `GET /api/customers/:id` - Détails d'un client

#### Orders (Commandes)
- `POST /api/orders` - Crée une nouvelle commande
- `GET /api/orders` - Liste toutes les commandes
- `GET /api/orders/:id` - Détails d'une commande

#### Payments (Paiements)
- `POST /api/payments` - Crée un nouveau paiement
- `GET /api/payments` - Liste tous les paiements
- `GET /api/payments/:id` - Détails d'un paiement

#### Payment Methods (Méthodes de paiement)
- `GET /api/payment-methods` - Liste toutes les méthodes
- `GET /api/payment-methods/:id` - Détails d'une méthode

#### Cities (Villes)
- `GET /api/cities` - Liste toutes les villes
- `GET /api/cities/:id` - Détails d'une ville

#### Products (Produits)
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit

📚 **Documentation complète** : Voir [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) pour les détails de chaque endpoint.

## 📊 Connexion Power BI

### Méthode 1: DirectQuery (Recommandé - Temps réel)

1. Ouvrez Power BI Desktop
2. **Obtenir des données** > **Base de données** > **PostgreSQL**
3. Entrez les informations de connexion :
   - **Serveur**: `localhost`
   - **Port**: `5432`
   - **Base de données**: `gei_bi_platform`
   - **Mode de connectivité**: **DirectQuery**
4. Entrez vos identifiants :
   - **User**: `postgres`
   - **Password**: `postgres`
5. Sélectionnez les tables : `sales`, `products`, `cities`, `provinces`

### Méthode 2: Import avec Refresh

1. Même procédure mais choisissez **Import** au lieu de DirectQuery
2. Configurez un refresh automatique dans Power BI Service

### Requêtes DAX recommandées

#### Chiffre d'affaires total
```dax
CA Total = SUM(sales[totalPrice])
```

#### Ventes par ville
```dax
Ventes par Ville = 
SUMMARIZE(
    sales,
    cities[name],
    "Total Ventes", SUM(sales[totalPrice])
)
```

#### Top 5 produits
```dax
Top 5 Produits = 
TOPN(
    5,
    SUMMARIZE(
        sales,
        products[name],
        "CA", SUM(sales[totalPrice])
    ),
    [CA],
    DESC
)
```

## 📈 Dashboards recommandés

### Dashboard 1: Vue globale
- Chiffre d'affaires total (KPI)
- Nombre de ventes (KPI)
- Top 5 produits (Graphique en barres)
- Évolution temporelle (Graphique linéaire)

### Dashboard 2: Analyse géographique
- Carte de Kinshasa avec ventes par commune
- Tableau des ventes par point de vente
- Graphique en secteurs par ville

### Dashboard 3: Analyse temporelle
- Ventes par heure (Graphique en colonnes)
- Pic de consommation (Graphique linéaire)
- Tendances journalières (Graphique en aires)

## 🗂️ Structure du projet

```
gei-bi-platform/
├── src/
│   ├── entities/              # Entités TypeORM (9 entités)
│   │   ├── province.entity.ts
│   │   ├── city.entity.ts
│   │   ├── product.entity.ts
│   │   ├── customer.entity.ts
│   │   ├── order.entity.ts
│   │   ├── order-item.entity.ts
│   │   ├── payment.entity.ts
│   │   ├── payment-method.entity.ts
│   │   └── sale.entity.ts
│   ├── database/              # Scripts de seed
│   │   ├── seed.ts
│   │   └── run-seed.ts
│   ├── sales/                 # Module Sales
│   ├── customers/             # Module Customers
│   ├── orders/                # Module Orders
│   ├── payments/              # Module Payments
│   ├── payment-methods/        # Module Payment Methods
│   ├── cities/                # Module Cities
│   ├── products/              # Module Products
│   ├── app.module.ts
│   └── main.ts
├── simulator/                 # Simulateurs Python
│   ├── sales_simulator.py
│   ├── orders_simulator.py
│   └── requirements.txt
├── docker-compose.yml         # Configuration Docker
├── Dockerfile.dev             # Dockerfile développement
├── env.example                # Exemple de configuration
├── package.json
├── DOCUMENTATION.md           # Documentation complète
├── COHERENCE_CHECK.md         # Vérification de cohérence
├── DOCKER_SETUP.md            # Guide Docker
├── RESET_DB.md                # Guide réinitialisation
└── README.md                  # Ce fichier
```

📚 **Documentation complète** : Voir [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) pour tous les détails.

## 📊 Structure de la Base de Données

### Tables principales

- **`provinces`** : 26 provinces de la RDC
- **`cities`** : 150+ villes et communes (dont 24 communes de Kinshasa)
- **`products`** : 80+ produits de matériaux de construction
- **`customers`** : 200+ clients (particuliers, entreprises, entrepreneurs)
- **`orders`** : 500+ commandes avec items
- **`order_items`** : Items de commande
- **`payments`** : Paiements associés aux commandes
- **`payment_methods`** : 6 méthodes de paiement (Espèces, Carte, Mobile Money, etc.)
- **`sales`** : Ventes directes (historique)

📚 **Documentation complète** : Voir [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) pour le schéma complet et les relations.

### Données géographiques

- **Kinshasa** : 24 communes (Bandalungwa, Barumbu, Bumbu, Gombe, Kalamu, etc.)
- **Autres provinces** : Principales villes de chaque province
  - Kongo-Central : Matadi, Boma, Muanda, etc.
  - Haut-Katanga : Lubumbashi, Likasi, Kipushi, etc.
  - Nord-Kivu : Goma, Beni, Butembo, etc.
  - Et bien d'autres...

### Catalogue produits

Le catalogue comprend 8 catégories principales :
- **Ciment** : Ciment Portland, gris, blanc (différents formats)
- **Acier** : Fer à béton (6mm à 20mm), treillis, fil de fer
- **Granulat** : Sable, gravier, pierre concassée, laterite
- **Maçonnerie** : Briques, parpaings, agglo
- **Couverture** : Tôles ondulées, trapézoïdales, tuiles
- **Finition** : Peintures, enduits, carrelage
- **Menuiserie** : Portes, fenêtres (PVC, aluminium, bois)
- **Plomberie/Électricité** : Tuyaux, raccords, câbles, interrupteurs
- **Quincaillerie** : Clous, vis, chevilles, colles

## 🔧 Scripts disponibles

```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

## 📝 Notes importantes

- **Seed obligatoire** : Exécutez `npm run seed` avant de lancer le simulateur
- Le simulateur Python peut tourner 24/7 pour générer des données continues
- Les données sont stockées dans PostgreSQL (Docker local)
- Power BI peut se connecter en DirectQuery pour un affichage quasi temps réel
- Le système simule une **vraie grande entreprise** avec présence dans toute la RDC
- **150+ villes/communes**, **80+ produits**, **200+ clients**, **500+ commandes** pour une analyse BI complète

## 📚 Documentation

- **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** - 📖 **Guide complet unifié** - Toutes les informations en un seul document

## 🎯 Pour l'exposé au Club GEI

### Points clés à présenter

1. **Architecture moderne**: Backend API + Data Warehouse + BI
2. **Réalisme**: Simule un vrai système d'entreprise
3. **Temps réel**: DirectQuery permet l'analyse en direct
4. **Scalabilité**: Architecture prête pour la production
5. **Business Value**: Décisions basées sur les données

### Démonstration

1. Démarrer le backend NestJS
2. Lancer le simulateur Python
3. Montrer les données qui arrivent en temps réel
4. Ouvrir Power BI et montrer les dashboards
5. Expliquer l'architecture et les bénéfices

## 📞 Support

Pour toute question ou problème, consultez la documentation :
- [NestJS](https://docs.nestjs.com)
- [Supabase](https://supabase.com/docs)
- [Power BI](https://docs.microsoft.com/power-bi)

---

**Développé pour le Club GEI** 🚀

