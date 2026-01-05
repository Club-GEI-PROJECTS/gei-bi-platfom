# 📚 Documentation Complète - Plateforme BI Club GEI

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Structure de la base de données](#structure-de-la-base-de-données)
4. [API Endpoints](#api-endpoints)
5. [Installation et configuration](#installation-et-configuration)
6. [Guide d'utilisation](#guide-dutilisation)
7. [Simulateurs](#simulateurs)
8. [Intégration Power BI](#intégration-power-bi)
9. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

La **Plateforme BI du Club GEI** est un système complet de Business Intelligence simulant la collecte et l'analyse de données de ventes pour une grande entreprise de matériaux de construction opérant dans toute la République Démocratique du Congo (RDC).

### Caractéristiques principales

- ✅ **Collecte de données en temps réel** via API REST
- ✅ **Base de données PostgreSQL** avec structure relationnelle complète
- ✅ **Simulateurs Python** pour générer des données réalistes
- ✅ **Intégration Power BI** pour la visualisation
- ✅ **Architecture Docker** pour le développement local
- ✅ **200+ clients**, **500+ commandes**, **6 méthodes de paiement**
- ✅ **26 provinces**, **150+ villes/communes**, **80+ produits**

---

## 🏗️ Architecture

### Architecture globale

```
┌─────────────────┐
│  Simulateurs    │
│     Python      │
│  (24/7)         │
└────────┬────────┘
         │ HTTP REST
         ↓
┌─────────────────┐
│  Backend NestJS │
│  API REST       │
│  Port 3000      │
└────────┬────────┘
         │ TypeORM
         ↓
┌─────────────────┐
│   PostgreSQL    │
│   (Docker)      │
│   Port 5432     │
└────────┬────────┘
         │ DirectQuery
         ↓
┌─────────────────┐
│   Power BI      │
│   Desktop       │
└─────────────────┘
```

### Stack technologique

| Composant | Technologie | Version |
|-----------|-----------|---------|
| Backend | NestJS | 10.x |
| ORM | TypeORM | 0.3.x |
| Base de données | PostgreSQL | 15 |
| Langage | TypeScript | 5.x |
| Simulateur | Python | 3.8+ |
| Conteneurisation | Docker Compose | 2.x |

### Services Docker

- **postgres** : Base de données PostgreSQL (port 5432)
- **backend** : Application NestJS (port 3000)
- **adminer** : Interface web PostgreSQL (port 8080)
- **pgadmin** : Interface avancée PostgreSQL (port 5050)

---

## 🗄️ Structure de la base de données

### Modèle de données relationnel

```
┌─────────────┐
│  Provinces  │
└──────┬──────┘
       │ 1:N
       ↓
┌─────────────┐      ┌──────────────┐
│   Cities    │      │  Customers   │
└──────┬──────┘      └──────┬───────┘
       │                     │ 1:N
       │ N:1                 ↓
       │              ┌──────────────┐
       │              │   Orders     │
       │              └──────┬───────┘
       │                     │ 1:N
       │                     ↓
       │              ┌──────────────┐
       │              │ OrderItems   │
       │              └──────┬───────┘
       │                     │ N:1
       │                     ↓
       │              ┌──────────────┐
       │              │  Products    │
       │              └──────────────┘
       │
       │ N:1
       ↓
┌─────────────┐      ┌──────────────┐
│   Sales     │      │   Payments   │
└─────────────┘      └──────┬───────┘
                            │ N:1
                            ↓
                    ┌──────────────┐
                    │PaymentMethods│
                    └──────────────┘
```

### Entités principales

#### 1. **Province** (`provinces`)
Représente les 26 provinces de la RDC.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `name` | VARCHAR(100) | Nom de la province |
| `code` | VARCHAR(10) | Code unique (ex: KIN, HKA) |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** : `OneToMany` → `City`

#### 2. **City** (`cities`)
Villes et communes de la RDC (150+ entrées).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `name` | VARCHAR(100) | Nom de la ville/commune |
| `type` | VARCHAR(20) | 'ville' ou 'commune' |
| `provinceId` | UUID | Référence à Province |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** :
- `ManyToOne` → `Province`
- `OneToMany` → `Sale`, `Order`, `Customer`

#### 3. **Product** (`products`)
Catalogue de 80+ produits de matériaux de construction.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `name` | VARCHAR(100) | Nom du produit |
| `category` | VARCHAR(50) | Catégorie (Ciment, Acier, etc.) |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** : `OneToMany` → `Sale`, `OrderItem`

#### 4. **Customer** (`customers`)
Clients de l'entreprise (200+ clients).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `firstName` | VARCHAR(100) | Prénom |
| `lastName` | VARCHAR(100) | Nom |
| `phone` | VARCHAR(20) | Téléphone |
| `email` | VARCHAR(100) | Email (optionnel) |
| `customerType` | VARCHAR(50) | particulier, entreprise, entrepreneur, gouvernement |
| `companyName` | VARCHAR(200) | Nom de l'entreprise (si applicable) |
| `address` | VARCHAR(200) | Adresse |
| `cityId` | UUID | Ville de résidence |
| `taxId` | VARCHAR(50) | Numéro d'identification fiscale |
| `isActive` | BOOLEAN | Client actif |
| `totalSpent` | DECIMAL(10,2) | Montant total dépensé |
| `totalOrders` | INT | Nombre de commandes |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** :
- `ManyToOne` → `City`
- `OneToMany` → `Order`

#### 5. **Order** (`orders`)
Commandes clients (500+ commandes).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `orderNumber` | VARCHAR(50) | Numéro unique (CMD-YYYY-XXXXXX) |
| `customerId` | UUID | Référence au client |
| `deliveryCityId` | UUID | Ville de livraison |
| `deliveryAddress` | VARCHAR(200) | Adresse de livraison |
| `status` | VARCHAR(20) | en_attente, confirmée, en_traitement, expédiée, livrée, annulée |
| `subtotal` | DECIMAL(10,2) | Sous-total avant taxes |
| `tax` | DECIMAL(10,2) | Taxes (16% TVA) |
| `shippingCost` | DECIMAL(10,2) | Frais de livraison |
| `totalAmount` | DECIMAL(10,2) | Montant total |
| `orderDate` | TIMESTAMP | Date de commande |
| `deliveryDate` | TIMESTAMP | Date de livraison prévue |
| `completedDate` | TIMESTAMP | Date de livraison effective |
| `notes` | TEXT | Notes sur la commande |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** :
- `ManyToOne` → `Customer`, `City`
- `OneToMany` → `OrderItem`, `Payment`, `Sale`

#### 6. **OrderItem** (`order_items`)
Items d'une commande.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `orderId` | UUID | Référence à Order |
| `productId` | UUID | Référence au produit |
| `quantity` | INT | Quantité |
| `unitPrice` | DECIMAL(10,2) | Prix unitaire |
| `totalPrice` | DECIMAL(10,2) | Prix total de la ligne |
| `createdAt` | TIMESTAMP | Date de création |

**Relations** :
- `ManyToOne` → `Order`, `Product`

#### 7. **PaymentMethod** (`payment_methods`)
Méthodes de paiement disponibles.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `name` | VARCHAR(50) | Nom (Espèces, Carte bancaire, etc.) |
| `description` | VARCHAR(100) | Description |
| `isActive` | BOOLEAN | Méthode active |
| `requiresOnline` | BOOLEAN | Nécessite connexion en ligne |
| `createdAt` | TIMESTAMP | Date de création |
| `updatedAt` | TIMESTAMP | Date de mise à jour |

**Relations** : `OneToMany` → `Payment`

#### 8. **Payment** (`payments`)
Paiements associés aux commandes.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `transactionId` | VARCHAR(50) | Numéro de transaction unique |
| `orderId` | UUID | Référence à Order |
| `paymentMethodId` | UUID | Méthode de paiement |
| `amount` | DECIMAL(10,2) | Montant |
| `status` | VARCHAR(20) | en_attente, complété, échoué, remboursé |
| `paymentDate` | TIMESTAMP | Date de paiement |
| `reference` | VARCHAR(100) | Référence transaction |
| `notes` | TEXT | Notes |
| `createdAt` | TIMESTAMP | Date de création |

**Relations** :
- `ManyToOne` → `Order`, `PaymentMethod`

#### 9. **Sale** (`sales`)
Ventes directes (historique).

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique |
| `cityId` | UUID | Ville de vente |
| `pointOfSale` | VARCHAR(100) | Point de vente |
| `productId` | UUID | Produit vendu |
| `quantity` | INT | Quantité |
| `unitPrice` | DECIMAL(10,2) | Prix unitaire |
| `totalPrice` | DECIMAL(10,2) | Prix total |
| `orderId` | UUID | Lien vers Order (optionnel) |
| `saleDate` | TIMESTAMP | Date de vente |
| `createdAt` | TIMESTAMP | Date de création |

**Relations** :
- `ManyToOne` → `City`, `Product`, `Order`

### Index et performances

- **Index sur `cities.provinceId`** : Recherche rapide des villes par province
- **Index sur `sales.cityId`** : Recherche rapide des ventes par ville
- **Index sur `sales.saleDate`** : Requêtes temporelles optimisées
- **Index sur `orders.orderDate`** : Requêtes temporelles optimisées
- **Index sur `orders.status`** : Filtrage par statut
- **Index sur `payments.paymentDate`** : Requêtes temporelles optimisées
- **Index sur `payments.status`** : Filtrage par statut
- **Index sur `customers.phone`** : Recherche rapide par téléphone

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Format de réponse standard

**Succès :**
```json
{
  "success": true,
  "message": "Message de succès",
  "data": { ... },
  "count": 123  // Pour les listes
}
```

**Erreur :**
```json
{
  "statusCode": 404,
  "message": "Message d'erreur",
  "error": "Not Found"
}
```

---

### 🛒 Sales (Ventes)

#### `POST /api/sales`
Crée une nouvelle vente.

**Body :**
```json
{
  "city": "Kinshasa",
  "pointOfSale": "Dépôt Central",
  "product": "Ciment Portland 50kg",
  "quantity": 10,
  "unitPrice": 15.00
}
```

**Response :** `201 Created`
```json
{
  "success": true,
  "message": "Vente enregistrée avec succès",
  "data": {
    "id": "uuid",
    "cityId": "uuid",
    "productId": "uuid",
    "pointOfSale": "Dépôt Central",
    "quantity": 10,
    "unitPrice": 15.00,
    "totalPrice": 150.00,
    "saleDate": "2026-01-05T15:30:00Z",
    "createdAt": "2026-01-05T15:30:00Z"
  }
}
```

#### `GET /api/sales`
Récupère toutes les ventes.

**Response :** `200 OK`
```json
{
  "success": true,
  "count": 150,
  "data": [ ... ]
}
```

#### `GET /api/sales/stats`
Récupère les statistiques globales.

**Response :** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalSales": 150,
    "totalRevenue": 45000.00
  }
}
```

---

### 👥 Customers (Clients)

#### `POST /api/customers`
Crée un nouveau client.

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Kabila",
  "phone": "+243900000000",
  "email": "jean.kabila@gmail.com",
  "customerType": "particulier",
  "address": "Avenue 123, Kinshasa",
  "cityId": "uuid",
  "isActive": true
}
```

**Response :** `201 Created`

#### `GET /api/customers`
Récupère tous les clients.

**Response :** `200 OK`

#### `GET /api/customers/:id`
Récupère un client par ID.

**Response :** `200 OK`

---

### 📦 Orders (Commandes)

#### `POST /api/orders`
Crée une nouvelle commande avec items.

**Body :**
```json
{
  "customerId": "uuid",
  "deliveryCityId": "uuid",
  "deliveryAddress": "Avenue 123, Kinshasa",
  "status": "confirmée",
  "subtotal": 1000.00,
  "tax": 160.00,
  "shippingCost": 25.00,
  "totalAmount": 1185.00,
  "orderDate": "2026-01-05T15:30:00Z",
  "items": [
    {
      "productId": "uuid",
      "quantity": 10,
      "unitPrice": 15.00,
      "totalPrice": 150.00
    }
  ]
}
```

**Response :** `201 Created`
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "id": "uuid",
    "orderNumber": "CMD-2026-000001",
    "customer": { ... },
    "deliveryCity": { ... },
    "items": [ ... ],
    "totalAmount": 1185.00
  }
}
```

#### `GET /api/orders`
Récupère toutes les commandes.

**Response :** `200 OK`

#### `GET /api/orders/:id`
Récupère une commande par ID.

**Response :** `200 OK`

---

### 💳 Payments (Paiements)

#### `POST /api/payments`
Crée un nouveau paiement.

**Body :**
```json
{
  "orderId": "uuid",
  "paymentMethodId": "uuid",
  "amount": 1185.00,
  "status": "complété",
  "paymentDate": "2026-01-05T15:30:00Z",
  "reference": "CAR123456"
}
```

**Response :** `201 Created`

#### `GET /api/payments`
Récupère tous les paiements.

**Response :** `200 OK`

#### `GET /api/payments/:id`
Récupère un paiement par ID.

**Response :** `200 OK`

---

### 💰 Payment Methods (Méthodes de paiement)

#### `GET /api/payment-methods`
Récupère toutes les méthodes de paiement actives.

**Response :** `200 OK`
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "uuid",
      "name": "Espèces",
      "description": "Paiement en espèces sur place",
      "isActive": true,
      "requiresOnline": false
    },
    {
      "id": "uuid",
      "name": "Carte bancaire",
      "description": "Paiement par carte bancaire",
      "isActive": true,
      "requiresOnline": true
    }
  ]
}
```

#### `GET /api/payment-methods/:id`
Récupère une méthode de paiement par ID.

**Response :** `200 OK`

---

### 🏙️ Cities (Villes)

#### `GET /api/cities`
Récupère toutes les villes.

**Response :** `200 OK`
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "id": "uuid",
      "name": "Kinshasa",
      "type": "commune",
      "province": {
        "id": "uuid",
        "name": "Kinshasa",
        "code": "KIN"
      }
    }
  ]
}
```

#### `GET /api/cities/:id`
Récupère une ville par ID.

**Response :** `200 OK`

---

### 📦 Products (Produits)

#### `GET /api/products`
Récupère tous les produits.

**Response :** `200 OK`
```json
{
  "success": true,
  "count": 80,
  "data": [
    {
      "id": "uuid",
      "name": "Ciment Portland 50kg",
      "category": "Ciment"
    }
  ]
}
```

#### `GET /api/products/:id`
Récupère un produit par ID.

**Response :** `200 OK`

---

## 🚀 Installation et configuration

### Prérequis

- **Node.js** 18+ et npm
- **Python** 3.8+
- **Docker** et Docker Compose
- **Power BI Desktop** (optionnel)

### Installation complète

#### 1. Cloner le projet
```bash
git clone <repository-url>
cd gei-bi-platform
```

#### 2. Configuration Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que les services sont en cours d'exécution
docker-compose ps
```

**Services disponibles :**
- PostgreSQL : `localhost:5432`
- Backend NestJS : `localhost:3000`
- Adminer : `http://localhost:8080`
- pgAdmin : `http://localhost:5050`

#### 3. Configuration Backend

```bash
# Installer les dépendances
npm install

# Le fichier .env est automatiquement utilisé en Docker
# Les variables sont définies dans docker-compose.yml
```

#### 4. Peupler la base de données

```bash
# Exécuter le seed
docker exec -it gei-bi-backend npm run seed

# Ou depuis votre machine locale
npm run seed
```

Le seed crée :
- ✅ 26 provinces de la RDC
- ✅ 150+ villes et communes
- ✅ 80+ produits
- ✅ 6 méthodes de paiement
- ✅ 200 clients
- ✅ 500 commandes avec items et paiements

#### 5. Démarrer le backend

```bash
# Le backend démarre automatiquement avec Docker
# Pour redémarrer manuellement :
docker-compose restart backend

# Vérifier les logs
docker-compose logs -f backend
```

#### 6. Configuration du simulateur

```bash
cd simulator

# Installer les dépendances Python
pip install -r requirements.txt

# Lancer le simulateur de ventes
python sales_simulator.py

# OU lancer le simulateur de commandes
python orders_simulator.py
```

---

## 📖 Guide d'utilisation

### Workflow complet

1. **Démarrer les services Docker**
   ```bash
   docker-compose up -d
   ```

2. **Vérifier que le backend est prêt**
   ```bash
   curl http://localhost:3000/api/sales/stats
   ```

3. **Exécuter le seed** (première fois uniquement)
   ```bash
   docker exec -it gei-bi-backend npm run seed
   ```

4. **Lancer le simulateur**
   ```bash
   cd simulator
   python orders_simulator.py
   ```

5. **Vérifier les données**
   - Via API : `curl http://localhost:3000/api/orders`
   - Via Adminer : `http://localhost:8080`
   - Via pgAdmin : `http://localhost:5050`

### Commandes utiles

```bash
# Voir les logs du backend
docker-compose logs -f backend

# Redémarrer le backend
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Supprimer toutes les données
docker-compose down -v

# Accéder à la base de données
docker exec -it gei-bi-postgres psql -U postgres -d gei_bi_platform
```

---

## 🤖 Simulateurs

### Sales Simulator (`sales_simulator.py`)

Simulateur de ventes simples qui :
- Génère des ventes aléatoires
- Utilise toutes les villes de la RDC
- Envoie les données à `/api/sales`
- Détecte automatiquement si les endpoints de commandes existent

**Utilisation :**
```bash
cd simulator
python sales_simulator.py
```

### Orders Simulator (`orders_simulator.py`)

Simulateur complet de commandes qui :
- Crée des clients (ou utilise existants)
- Génère des commandes avec 1-5 produits
- Calcule taxes et frais de livraison
- Crée des paiements associés
- Gère les statuts de commande

**Utilisation :**
```bash
cd simulator
python orders_simulator.py
```

**Fonctionnalités :**
- Génération de 200 clients variés
- Commandes avec items multiples
- Paiements avec différentes méthodes
- Statuts réalistes (en_attente, confirmée, livrée, etc.)

---

## 📊 Intégration Power BI

### Connexion à PostgreSQL

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

### Tables disponibles

- `provinces` - Provinces de la RDC
- `cities` - Villes et communes
- `products` - Catalogue produits
- `customers` - Clients
- `orders` - Commandes
- `order_items` - Items de commande
- `payments` - Paiements
- `payment_methods` - Méthodes de paiement
- `sales` - Ventes directes

### Requêtes DAX recommandées

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

### Dashboards recommandés

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

---

## 🔧 Dépannage

### Problèmes courants

#### 1. Backend ne démarre pas

**Symptôme :** Erreur de connexion à la base de données

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

**Symptôme :** Les tables n'existent pas

**Solution :**
```bash
# Vérifier que synchronize est activé dans app.module.ts
# Ou exécuter le seed
docker exec -it gei-bi-backend npm run seed
```

#### 3. Simulateur ne se connecte pas

**Symptôme :** `Connection refused` ou timeout

**Solution :**
```bash
# Vérifier que le backend est accessible
curl http://localhost:3000/api/sales/stats

# Vérifier les logs
docker-compose logs backend
```

#### 4. Données manquantes

**Symptôme :** Pas de clients, produits, etc.

**Solution :**
```bash
# Réexécuter le seed
docker exec -it gei-bi-backend npm run seed
```

#### 5. Port déjà utilisé

**Symptôme :** `EADDRINUSE: address already in use`

**Solution :**
```bash
# Arrêter le service qui utilise le port
# Ou modifier le port dans docker-compose.yml
```

### Logs et debugging

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

### Réinitialisation complète

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

## 📝 Notes importantes

### Sécurité

- ⚠️ **CORS activé pour tous les origines** : À restreindre en production
- ⚠️ **Mots de passe en clair** : À utiliser des variables d'environnement sécurisées
- ⚠️ **SSL désactivé** : À activer en production

### Performance

- Les index sont configurés pour optimiser les requêtes
- DirectQuery dans Power BI permet l'analyse en temps réel
- Le simulateur peut générer des données 24/7

### Limitations

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
- `DOCKER_SETUP.md` - Configuration Docker
- `RESET_DB.md` - Réinitialisation de la base
- `env.example` - Exemple de configuration

---

**Développé pour le Club GEI** 🚀

*Dernière mise à jour : Janvier 2026*

