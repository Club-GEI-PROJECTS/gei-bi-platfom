# 🐳 Configuration Docker - Guide de démarrage

## 🚀 Démarrage rapide

### 1. Démarrer tous les services avec Docker

```bash
# Démarrer PostgreSQL, Backend, Adminer et pgAdmin
docker-compose up -d

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps
```

Vous devriez voir :
- `gei-bi-postgres` : Base de données PostgreSQL
- `gei-bi-backend` : Application NestJS
- `gei-bi-adminer` : Interface web simple pour PostgreSQL
- `gei-bi-pgadmin` : Interface web avancée pour PostgreSQL (optionnel)

### 2. Accéder aux services

Une fois les conteneurs démarrés, vous pouvez accéder à :

- **Backend API** : http://localhost:3000
- **API Documentation** : http://localhost:3000/api
- **Adminer** : http://localhost:8080 (interface simple pour PostgreSQL)
- **pgAdmin** : http://localhost:5050 (interface avancée - optionnel)

### 3. Configurer Adminer (recommandé - plus simple)

1. Ouvrez http://localhost:8080
2. Remplissez les informations :
   - **Système** : PostgreSQL
   - **Serveur** : `postgres`
   - **Utilisateur** : `postgres`
   - **Mot de passe** : `postgres`
   - **Base de données** : `gei_bi_platform`
3. Cliquez sur **Connexion**

### 4. Peupler la base de données

```bash
# Exécuter le seed depuis le conteneur backend
docker exec -it gei-bi-backend npm run seed

# OU depuis votre machine locale (si vous avez npm installé)
npm run seed
```

## 📊 Accéder à pgAdmin (optionnel - interface avancée)

1. Ouvrez votre navigateur
2. Allez sur : http://localhost:5050
3. Connectez-vous avec :
   - **Email** : `admin@admin.com`
   - **Password** : `admin`
4. Ajoutez un serveur :
   - **Name** : GEI BI Platform
   - **Host** : `postgres` (nom du service Docker)
   - **Port** : `5432`
   - **Username** : `postgres`
   - **Password** : `postgres`

## 🛠️ Commandes Docker utiles

### Démarrer les services
```bash
docker-compose up -d
```

### Arrêter les services
```bash
docker-compose down
```

### Voir les logs
```bash
# Logs du backend
docker-compose logs backend

# Logs de PostgreSQL
docker-compose logs postgres

# Logs de tous les services
docker-compose logs -f

# Logs en temps réel du backend
docker-compose logs -f backend
```

### Redémarrer les services
```bash
docker-compose restart
```

### Supprimer les données (⚠️ Attention : supprime toutes les données)
```bash
docker-compose down -v
```

### Vérifier l'état des conteneurs
```bash
docker-compose ps
```

## 🔍 Vérifier la connexion à la base de données

### Avec psql (si installé)
```bash
psql -h localhost -U postgres -d gei_bi_platform
# Mot de passe : postgres
```

### Avec Docker
```bash
docker exec -it gei-bi-postgres psql -U postgres -d gei_bi_platform
```

## 📝 Structure des données

Une fois le seed exécuté, vous aurez :
- **26 provinces** de la RDC
- **150+ villes/communes** (dont 24 communes de Kinshasa)
- **80+ produits** de matériaux de construction

## 🐛 Dépannage

### Le conteneur ne démarre pas
```bash
# Vérifier les logs
docker-compose logs postgres

# Vérifier que le port 5432 n'est pas utilisé
netstat -an | findstr 5432  # Windows
lsof -i :5432                # Mac/Linux
```

### Erreur de connexion
- Vérifiez que le conteneur est en cours d'exécution : `docker-compose ps`
- Vérifiez votre fichier `.env`
- Attendez quelques secondes que PostgreSQL soit prêt (healthcheck)

### Réinitialiser la base de données
```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer
docker-compose up -d

# Ré-exécuter le seed
docker exec -it gei-bi-backend npm run seed
```

### Reconstruire le backend après modification du code
```bash
# Reconstruire l'image du backend
docker-compose build backend

# Redémarrer le backend
docker-compose up -d backend
```

## 🎯 Avantages de Docker

✅ **Simple** : Pas besoin de configurer PostgreSQL ou Node.js manuellement  
✅ **Isolé** : N'affecte pas votre système  
✅ **Portable** : Fonctionne sur Windows, Mac, Linux  
✅ **Rapide** : Démarrage en quelques secondes  
✅ **Reproductible** : Même environnement pour tous  
✅ **Hot-reload** : Le backend se recharge automatiquement lors des modifications  
✅ **Tout-en-un** : Base de données + Backend + Interfaces web  

## 📚 Ressources

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation pgAdmin](https://www.pgadmin.org/docs/)

---

**C'est parti ! 🚀**

