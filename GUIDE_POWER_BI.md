# 📊 Guide Power BI - Club GEI

## 🔌 Connexion à Supabase

### Étape 1 : Obtenir les données

1. Ouvrez **Power BI Desktop**
2. Cliquez sur **Obtenir des données** (Get Data)
3. Sélectionnez **Base de données** > **Base de données PostgreSQL**
4. Cliquez sur **Connecter**

### Étape 2 : Configurer la connexion

Remplissez les informations (identiques à votre fichier `.env`) :

- **Serveur**: `db.xxxxx.supabase.co` (votre host Supabase)
- **Base de données**: `postgres`
- **Mode de connectivité**: 
  - ✅ **DirectQuery** (recommandé - temps réel)
  - ⚠️ **Import** (plus rapide mais nécessite refresh)

### Étape 3 : Authentification

- **Type d'authentification**: Base de données
- **Nom d'utilisateur**: `postgres`
- **Mot de passe**: Votre mot de passe Supabase

### Étape 4 : Sélectionner les tables

Cochez les tables suivantes :
- ✅ `sales`
- ✅ `products`
- ✅ `cities`

Cliquez sur **Charger** (ou **Transformer les données** si vous voulez modifier avant)

---

## 📈 Mesures DAX recommandées

### 1. Chiffre d'affaires total

```dax
CA Total = SUM(sales[totalPrice])
```

### 2. Nombre de ventes

```dax
Nombre de Ventes = COUNTROWS(sales)
```

### 3. Panier moyen

```dax
Panier Moyen = 
DIVIDE(
    [CA Total],
    [Nombre de Ventes],
    0
)
```

### 4. CA par jour

```dax
CA Journalier = 
CALCULATE(
    [CA Total],
    FILTER(
        sales,
        sales[saleDate] >= TODAY() - 7
    )
)
```

### 5. Top 5 produits

```dax
Top 5 Produits CA = 
TOPN(
    5,
    SUMMARIZE(
        sales,
        products[name],
        "CA", [CA Total]
    ),
    [CA],
    DESC
)
```

### 6. Ventes par ville

```dax
CA par Ville = 
SUMMARIZE(
    sales,
    cities[name],
    "CA", [CA Total],
    "Ventes", [Nombre de Ventes]
)
```

### 7. Tendance temporelle (par heure)

```dax
CA par Heure = 
CALCULATE(
    [CA Total],
    GROUPBY(
        sales,
        HOUR(sales[saleDate]),
        "Heure", HOUR(sales[saleDate])
    )
)
```

---

## 🎨 Visualisations recommandées

### Dashboard 1 : Vue globale

#### KPI Cards
1. **Chiffre d'affaires total**
   - Type: Carte KPI
   - Mesure: `CA Total`
   - Format: Devise (USD ou CDF)

2. **Nombre de ventes**
   - Type: Carte KPI
   - Mesure: `Nombre de Ventes`
   - Format: Nombre

3. **Panier moyen**
   - Type: Carte KPI
   - Mesure: `Panier Moyen`
   - Format: Devise

#### Graphiques
1. **Top 5 produits**
   - Type: Graphique en barres horizontales
   - Axe Y: `products[name]`
   - Valeur: `CA Total`
   - Tri: Décroissant

2. **Évolution temporelle**
   - Type: Graphique en courbes
   - Axe X: `saleDate` (par jour)
   - Valeur: `CA Total`

3. **Répartition par ville**
   - Type: Graphique en secteurs
   - Légende: `cities[name]`
   - Valeur: `CA Total`

### Dashboard 2 : Analyse géographique

1. **Carte de Kinshasa** (si disponible)
   - Type: Carte
   - Emplacement: `cities[name]`
   - Taille: `CA Total`

2. **Tableau des points de vente**
   - Type: Table
   - Colonnes:
     - `pointOfSale`
     - `cities[name]`
     - `CA Total`
     - `Nombre de Ventes`
   - Tri: Par CA décroissant

3. **Graphique en barres par commune**
   - Type: Graphique en colonnes
   - Axe X: `cities[name]`
   - Valeur: `CA Total`

### Dashboard 3 : Analyse temporelle

1. **Ventes par heure**
   - Type: Graphique en colonnes
   - Axe X: `HOUR(saleDate)`
   - Valeur: `CA Total`
   - Titre: "Pic de consommation par heure"

2. **Tendance journalière**
   - Type: Graphique en aires
   - Axe X: `saleDate` (par jour)
   - Valeur: `CA Total`
   - Ligne de tendance: Activée

3. **Tableau temporel détaillé**
   - Type: Table
   - Colonnes:
     - `saleDate` (par heure)
     - `CA Total`
     - `Nombre de Ventes`
     - `products[name]`

---

## 🔄 DirectQuery vs Import

### DirectQuery (Recommandé) ✅

**Avantages:**
- ✅ Données toujours à jour (quasi temps réel)
- ✅ Pas de limite de taille de données
- ✅ Reflète les changements immédiatement

**Inconvénients:**
- ⚠️ Peut être plus lent (requêtes en direct)
- ⚠️ Nécessite une connexion active

**Quand l'utiliser:**
- Pour des dashboards en temps réel
- Quand les données changent fréquemment
- Pour de grandes quantités de données

### Import

**Avantages:**
- ✅ Plus rapide (données en cache)
- ✅ Fonctionne hors ligne
- ✅ Meilleures performances pour les calculs complexes

**Inconvénients:**
- ⚠️ Nécessite un refresh manuel ou programmé
- ⚠️ Limite de taille (1 Go en gratuit)

**Quand l'utiliser:**
- Pour des analyses historiques
- Quand la performance est critique
- Pour des présentations hors ligne

---

## 🔧 Configuration du Refresh (si Import)

1. Allez dans **Fichier** > **Options et paramètres** > **Options**
2. Cliquez sur **Actualisation planifiée**
3. Configurez :
   - **Actualiser automatiquement**: Activé
   - **Fréquence**: Toutes les heures (ou selon vos besoins)
   - **Heure**: Choisissez une heure

**Note**: Le refresh automatique nécessite Power BI Service (version payante). En version gratuite, vous devez actualiser manuellement.

---

## 📱 Partage du Dashboard

### Option 1 : Power BI Service (Recommandé)

1. Publiez votre rapport sur Power BI Service
2. Partagez avec votre équipe
3. Configurez les permissions

### Option 2 : Export PDF

1. **Fichier** > **Exporter** > **PDF**
2. Partagez le PDF

### Option 3 : Power BI Mobile

1. Installez l'app Power BI Mobile
2. Connectez-vous avec votre compte
3. Accédez à vos dashboards depuis votre téléphone

---

## 🎯 Conseils pour l'exposé

### Démonstration en direct

1. **Montrez la connexion** à Supabase
2. **Affichez les données** qui arrivent en temps réel
3. **Créez une visualisation** en direct
4. **Expliquez les insights** que vous pouvez tirer

### Points clés à mentionner

- ✅ **Temps réel**: DirectQuery permet l'analyse en direct
- ✅ **Scalabilité**: Architecture prête pour la production
- ✅ **Business Value**: Décisions basées sur les données
- ✅ **Réalisme**: Système similaire aux grandes entreprises

---

## 🐛 Dépannage

### Erreur de connexion

- Vérifiez vos identifiants Supabase
- Vérifiez que le serveur Supabase est accessible
- Vérifiez votre connexion internet

### Données ne se chargent pas

- Vérifiez que les tables existent dans Supabase
- Vérifiez les permissions de la base de données
- Essayez de recharger les données

### Performances lentes (DirectQuery)

- C'est normal avec DirectQuery
- Ajoutez des filtres pour limiter les données
- Considérez l'Import pour les analyses historiques

---

**Bon courage pour votre exposé ! 🚀**

