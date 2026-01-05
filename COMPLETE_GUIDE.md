# 📚 Guide Complet - Plateforme BI Club GEI

**Documentation unifiée** - Toutes les informations essentielles en un seul document

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Installation rapide](#2-installation-rapide)
3. [Configuration Docker](#3-configuration-docker)
4. [Configuration de la base de données](#4-configuration-de-la-base-de-données)
5. [Structure du projet](#5-structure-du-projet)
6. [API Endpoints](#6-api-endpoints)
7. [Simulateurs](#7-simulateurs)
8. [Intégration Power BI](#8-intégration-power-bi)
9. [Dépannage](#9-dépannage)
10. [Vérification de cohérence](#10-vérification-de-cohérence)

---

## 1. Vue d'ensemble

### 🎯 Description

La **Plateforme BI du Club GEI** est un système complet de Business Intelligence simulant la collecte et l'analyse de données de ventes pour une grande entreprise de matériaux de construction opérant dans toute la RDC.

### ✨ Caractéristiques

- ✅ **Collecte de données en temps réel** via API REST
- ✅ **Base de données PostgreSQL** (Docker local)
- ✅ **Simulateurs Python** pour générer des données réalistes
- ✅ **Intégration Power BI** pour la visualisation
- ✅ **200+ clients**, **500+ commandes**, **6 méthodes de paiement**
- ✅ **26 provinces**, **150+ villes/communes**, **80+ produits**

### 🏗️ Architecture

```
Simulateurs Python (24/7)
        ↓ HTTP REST
Backend NestJS (Port 3000)
        ↓ TypeORM
PostgreSQL Docker (Port 5432)
        ↓ DirectQuery
Power BI Desktop
```

### 📦 Stack technologique

- **Backend** : NestJS 10.x + TypeORM 0.3.x
- **Base de données** : PostgreSQL 15
- **Simulateur** : Python 3.8+
- **Conteneurisation** : Docker Compose

---

## 2. Installation rapide

### ⚡ En 5 minutes

#### 1. Prérequis
- Node.js 18+ et npm
- Python 3.8+
- Docker et Docker Compose
- Power BI Desktop (optionnel)

#### 2. Démarrer Docker
```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que les services sont en cours d'exécution
docker-compose ps
```

#### 3. Peupler la base de données
```bash
# Exécuter le seed
docker exec -it gei-bi-backend npm run seed
```

#### 4. Vérifier que tout fonctionne
```bash
# Tester l'API
curl http://localhost:3000/api/sales/stats
```

#### 5. Lancer le simulateur
```bash
cd simulator
pip install -r requirements.txt
python orders_simulator.py
```

✅ **C'est parti !** Les données commencent à arriver.

---

## 3. Configuration Docker

### 🐳 Services disponibles

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| PostgreSQL | 5432 | - | Base de données |
| Backend NestJS | 3000 | http://localhost:3000 | API REST |
| Adminer | 8080 | http://localhost:8080 | Interface web simple |
| pgAdmin | 5050 | http://localhost:5050 | Interface avancée |

### 📝 Commandes Docker essentielles

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Supprimer toutes les données (⚠️ Attention)
docker-compose down -v
```

### 🔧 Configuration Adminer

1. Ouvrez http://localhost:8080
2. Remplissez :
   - **Système** : PostgreSQL
   - **Serveur** : `postgres`
   - **Utilisateur** : `postgres`
   - **Mot de passe** : `postgres`
   - **Base de données** : `gei_bi_platform`
3. Cliquez sur **Connexion**

### 🔧 Configuration pgAdmin

1. Ouvrez http://localhost:5050
2. Connectez-vous :
   - **Email** : `admin@admin.com`
   - **Password** : `admin`
3. Ajoutez un serveur :
   - **Name** : GEI BI Platform
   - **Host** : `postgres`
   - **Port** : `5432`
   - **Username** : `postgres`
   - **Password** : `postgres`

---

## 4. Configuration de la base de données

### 🌱 Seed de la base de données

Le seed crée automatiquement :
- ✅ **26 provinces** de la RDC
- ✅ **150+ villes/communes** (dont 24 communes de Kinshasa)
- ✅ **80+ produits** de matériaux de construction
- ✅ **6 méthodes de paiement**
- ✅ **200 clients** variés
- ✅ **500 commandes** avec items et paiements

#### Exécuter le seed

```bash
# Depuis le conteneur Docker
docker exec -it gei-bi-backend npm run seed

# OU depuis votre machine locale
npm run seed
```

#### Résultat attendu

```
🌱 Début du seed de la base de données...
📦 Création des provinces...
  ✅ Province créée: Kinshasa
  ✅ Province créée: Kongo-Central
  ...
🏙️  Création des villes et communes...
  ✅ 150+ villes/communes créées
📦 Création du catalogue produits...
  ✅ 80+ produits créés
💳 Création des méthodes de paiement...
  ✅ 6 méthodes créées
👤 Création des clients...
  ✅ 200 clients créés
📦 Création des commandes...
  ✅ 500 commandes créées

✅ Seed terminé avec succès !
```

### 🔄 Réinitialiser la base de données

#### Option 1 : Supprimer uniquement les données (recommandé)
```bash
docker-compose down
docker volume rm gei-bi-platfom_postgres_data
docker-compose up -d
docker exec -it gei-bi-backend npm run seed
```

#### Option 2 : Supprimer tout
```bash
docker-compose down -v
docker-compose up -d
docker exec -it gei-bi-backend npm run seed
```

#### Option 3 : Supprimer uniquement les tables
```bash
docker exec gei-bi-postgres psql -U postgres -d gei_bi_platform -c "DROP TABLE IF EXISTS sales, products, cities, provinces, customers, orders, order_items, payments, payment_methods CASCADE;"
docker-compose restart backend
docker exec -it gei-bi-backend npm run seed
```

---

## 5. Structure du projet

### 📁 Organisation des fichiers

```
gei-bi-platform/
├── src/
│   ├── entities/              # 9 entités TypeORM
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
│   ├── cities/                 # Module Cities
│   ├── products/              # Module Products
│   ├── app.module.ts
│   └── main.ts
├── simulator/                 # Simulateurs Python
│   ├── sales_simulator.py
│   ├── orders_simulator.py
│   └── requirements.txt
├── docker-compose.yml
├── Dockerfile.dev
└── package.json
```

### 🗄️ Structure de la base de données

#### Tables principales

| Table | Description | Relations |
|-------|-------------|-----------|
| `provinces` | 26 provinces de la RDC | → `cities` |
| `cities` | 150+ villes/communes | ← `provinces`, → `sales`, `orders`, `customers` |
| `products` | 80+ produits | → `sales`, `order_items` |
| `customers` | 200+ clients | ← `cities`, → `orders` |
| `orders` | 500+ commandes | ← `customers`, `cities`, → `order_items`, `payments`, `sales` |
| `order_items` | Items de commande | ← `orders`, `products` |
| `payment_methods` | 6 méthodes de paiement | → `payments` |
| `payments` | Paiements | ← `orders`, `payment_methods` |
| `sales` | Ventes directes | ← `cities`, `products`, `orders` |

---

## 6. API Endpoints

### 🌐 Base URL
```
http://localhost:3000/api
```

### 📡 Endpoints disponibles

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

### 📝 Exemples de requêtes

#### Créer une vente
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Kinshasa",
    "pointOfSale": "Dépôt Central",
    "product": "Ciment Portland 50kg",
    "quantity": 10,
    "unitPrice": 15.00
  }'
```

#### Créer une commande
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "uuid",
    "deliveryCityId": "uuid",
    "deliveryAddress": "Avenue 123, Kinshasa",
    "status": "confirmée",
    "subtotal": 1000.00,
    "tax": 160.00,
    "shippingCost": 25.00,
    "totalAmount": 1185.00,
    "items": [
      {
        "productId": "uuid",
        "quantity": 10,
        "unitPrice": 15.00,
        "totalPrice": 150.00
      }
    ]
  }'
```

---

## 7. Simulateurs

### 🤖 Sales Simulator (`sales_simulator.py`)

Simulateur de ventes simples qui :
- Génère des ventes aléatoires
- Utilise toutes les villes de la RDC
- Détecte automatiquement si les endpoints de commandes existent

**Utilisation :**
```bash
cd simulator
pip install -r requirements.txt
python sales_simulator.py
```

### 🤖 Orders Simulator (`orders_simulator.py`)

Simulateur complet de commandes qui :
- Crée des clients (ou utilise existants)
- Génère des commandes avec 1-5 produits
- Calcule taxes et frais de livraison
- Crée des paiements associés

**Utilisation :**
```bash
cd simulator
pip install -r requirements.txt
python orders_simulator.py
```

**Fonctionnalités :**
- Génération de 200 clients variés
- Commandes avec items multiples
- Paiements avec différentes méthodes
- Statuts réalistes (en_attente, confirmée, livrée, etc.)

---

## 8. Intégration Power BI

### 🔌 Connexion à PostgreSQL

1. Ouvrir Power BI Desktop
2. **Obtenir des données** > **Base de données** > **PostgreSQL**
3. Configuration :
   - **Serveur** : `localhost`
   - **Port** : `5432`
   - **Base de données** : `gei_bi_platform`
   - **Mode** : **DirectQuery** (recommandé pour temps réel)
4. Identifiants :
   - **User** : `postgres`
   - **Password** : `postgres`

### 📊 Tables disponibles

- `provinces` - Provinces de la RDC
- `cities` - Villes et communes
- `products` - Catalogue produits
- `customers` - Clients
- `orders` - Commandes
- `order_items` - Items de commande
- `payments` - Paiements
- `payment_methods` - Méthodes de paiement
- `sales` - Ventes directes

### 📈 Requêtes DAX recommandées

#### Chiffre d'affaires total
```dax
CA Total = SUM(orders[totalAmount])
```

#### Ventes par ville
```dax
Ventes par Ville = 
SUMMARIZE(
    orders,
    cities[name],
    "Total", SUM(orders[totalAmount])
)
```

#### Top 10 clients
```dax
Top 10 Clients = 
TOPN(
    10,
    SUMMARIZE(
        orders,
        customers[firstName] & " " & customers[lastName],
        "CA", SUM(orders[totalAmount])
    ),
    [CA],
    DESC
)
```

#### Paiements par méthode
```dax
Paiements par Méthode = 
SUMMARIZE(
    payments,
    payment_methods[name],
    "Total", SUM(payments[amount])
)
```

### 🎨 Dashboards recommandés

#### Dashboard 1 : Vue globale
- KPI : Chiffre d'affaires total
- KPI : Nombre de commandes
- Graphique : Top 10 produits
- Graphique : Évolution temporelle

#### Dashboard 2 : Analyse clients
- KPI : Nombre de clients actifs
- Graphique : Répartition par type de client
- Tableau : Top 20 clients
- Graphique : CA par type de client

#### Dashboard 3 : Analyse géographique
- Carte : Ventes par province
- Graphique : Top 10 villes
- Tableau : Détails par commune de Kinshasa

#### Dashboard 4 : Analyse financière
- KPI : Total des paiements
- Graphique : Répartition par méthode de paiement
- Graphique : Taux de paiement complété
- Tableau : Commandes en attente de paiement

### 🔄 DirectQuery vs Import

**DirectQuery** (Recommandé) :
- ✅ Données toujours à jour (quasi temps réel)
- ✅ Pas de limite de taille
- ⚠️ Peut être plus lent

**Import** :
- ✅ Plus rapide (données en cache)
- ✅ Fonctionne hors ligne
- ⚠️ Nécessite un refresh manuel

---

## 9. Dépannage

### ❌ Problèmes courants

#### 1. Backend ne démarre pas

**Symptôme** : Erreur de connexion à la base de données

**Solution :**
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Redémarrer PostgreSQL
docker-compose restart postgres

# Attendre que PostgreSQL soit prêt
docker-compose logs postgres

# Redémarrer le backend
docker-compose restart backend
```

#### 2. Erreur "relation does not exist"

**Symptôme** : Les tables n'existent pas

**Solution :**
```bash
# Exécuter le seed
docker exec -it gei-bi-backend npm run seed
```

#### 3. Simulateur ne se connecte pas

**Symptôme** : `Connection refused` ou timeout

**Solution :**
```bash
# Vérifier que le backend est accessible
curl http://localhost:3000/api/sales/stats

# Vérifier les logs
docker-compose logs backend
```

#### 4. Données manquantes

**Symptôme** : Pas de clients, produits, etc.

**Solution :**
```bash
# Réexécuter le seed
docker exec -it gei-bi-backend npm run seed
```

#### 5. Port déjà utilisé

**Symptôme** : `EADDRINUSE: address already in use`

**Solution :**
```bash
# Arrêter le service qui utilise le port
# Ou modifier le port dans docker-compose.yml
```

### 🔍 Logs et debugging

```bash
# Logs du backend
docker-compose logs -f backend

# Logs de PostgreSQL
docker-compose logs -f postgres

# Logs de tous les services
docker-compose logs -f

# Accéder au shell du backend
docker exec -it gei-bi-backend sh

# Accéder à PostgreSQL
docker exec -it gei-bi-postgres psql -U postgres -d gei_bi_platform
```

### 🔄 Réinitialisation complète

```bash
# Arrêter tous les services
docker-compose down

# Supprimer toutes les données
docker-compose down -v

# Redémarrer
docker-compose up -d

# Réexécuter le seed
docker exec -it gei-bi-backend npm run seed
```

---

## 10. Vérification de cohérence

### ✅ Statut global : **COHÉRENT**

#### Points vérifiés

- ✅ **7 modules NestJS** complets (Controllers, Services, DTOs)
- ✅ **9 entités TypeORM** avec relations cohérentes
- ✅ **14 endpoints API** fonctionnels
- ✅ **2 simulateurs Python** opérationnels
- ✅ **Base de données** complète et réaliste
- ✅ **Index de performance** configurés
- ✅ **Validation des données** avec DTOs

#### Architecture

- ✅ Tous les modules enregistrés dans `AppModule`
- ✅ Configuration TypeORM correcte
- ✅ Relations entre entités cohérentes
- ✅ Clés étrangères correctement définies

#### Données

- ✅ Seed complet (26 provinces, 150+ villes, 80+ produits, 200 clients, 500 commandes)
- ✅ Relations respectées
- ✅ Données réalistes pour la RDC

---

## 📝 Notes importantes

### ⚠️ Sécurité

- ⚠️ **CORS ouvert à tous** (`origin: '*'`) - À restreindre en production
- ⚠️ **Pas d'authentification** - À ajouter en production
- ⚠️ **Mots de passe en clair** - À utiliser des secrets en production

### ⚡ Performance

- ✅ Index configurés pour optimiser les requêtes
- ✅ Relations eager chargées où nécessaire
- ⚠️ Pas de pagination sur les listes - À ajouter si nécessaire

### 📊 Limitations

- Le seed peut prendre quelques minutes (500 commandes)
- Le simulateur génère des données aléatoires
- Pas de système d'authentification (à ajouter en production)

---

## 🎯 Pour l'exposé au Club GEI

### Points clés à présenter

1. **Architecture moderne** : Backend API + Data Warehouse + BI
2. **Réalisme** : Simule un vrai système d'entreprise
3. **Temps réel** : DirectQuery permet l'analyse en direct
4. **Scalabilité** : Architecture prête pour la production
5. **Business Value** : Décisions basées sur les données

### Démonstration

1. Démarrer le backend NestJS
2. Lancer le simulateur Python
3. Montrer les données qui arrivent en temps réel
4. Ouvrir Power BI et montrer les dashboards
5. Expliquer l'architecture et les bénéfices

---

## 📞 Support

### Documentation externe

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Power BI Documentation](https://docs.microsoft.com/power-bi)

### Fichiers de référence

- `README.md` - Guide rapide
- `DOCUMENTATION.md` - Documentation complète
- `COHERENCE_CHECK.md` - Vérification de cohérence
- `DOCKER_SETUP.md` - Configuration Docker
- `RESET_DB.md` - Réinitialisation de la base
- `env.example` - Exemple de configuration

---

**Développé pour le Club GEI** 🚀

*Dernière mise à jour : Janvier 2026*

