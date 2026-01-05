# 🔄 Commandes pour réinitialiser la base de données

## Option 1 : Supprimer uniquement les données (recommandé)

```bash
# Arrêter tous les conteneurs
docker-compose down

# Supprimer le volume de données PostgreSQL
docker volume rm gei-bi-platfom_postgres_data

# Redémarrer les conteneurs (une nouvelle base vide sera créée)
docker-compose up -d
```

## Option 2 : Supprimer tout (conteneurs + volumes + réseau)

```bash
# Arrêter et supprimer tous les conteneurs, volumes et réseaux
docker-compose down -v

# Redémarrer (une nouvelle base vide sera créée)
docker-compose up -d
```

## Option 3 : Supprimer uniquement les tables (garder la base)

```bash
# Se connecter à PostgreSQL
docker exec gei-bi-postgres psql -U postgres -d gei_bi_platform

# Dans psql, exécuter :
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;

# Ou en une seule commande :
docker exec gei-bi-postgres psql -U postgres -d gei_bi_platform -c "DROP TABLE IF EXISTS sales, products, cities, provinces CASCADE;"
```

## Option 4 : Supprimer et recréer la base de données

```bash
# Supprimer la base de données
docker exec gei-bi-postgres psql -U postgres -c "DROP DATABASE IF EXISTS gei_bi_platform;"

# Recréer la base de données
docker exec gei-bi-postgres psql -U postgres -c "CREATE DATABASE gei_bi_platform;"

# Redémarrer le backend pour créer les tables
docker-compose restart backend
```

## ⚠️ Attention

- **Option 1 et 2** : Suppriment **TOUTES** les données (tables + données)
- **Option 3** : Supprime uniquement les tables (la base existe toujours)
- **Option 4** : Supprime et recrée la base de données

## Après la réinitialisation

Une fois la base réinitialisée, exécutez le seed pour peupler les données :

```bash
# Depuis le conteneur backend
docker exec -it gei-bi-backend npm run seed

# OU depuis votre machine locale (si vous avez npm installé)
npm run seed
```

