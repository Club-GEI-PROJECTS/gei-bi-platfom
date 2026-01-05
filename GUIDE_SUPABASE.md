# 🔧 Guide de configuration Supabase

## Étape 1 : Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte (gratuit) ou connectez-vous
3. Cliquez sur **New Project**
4. Remplissez les informations :
   - **Name**: `gei-bi-platform` (ou autre nom)
   - **Database Password**: Choisissez un mot de passe fort (⚠️ **SAVEZ-LE**)
   - **Region**: Choisissez la région la plus proche
5. Cliquez sur **Create new project**

## Étape 2 : Récupérer DIRECT_URL

1. Dans votre projet Supabase, allez dans **Settings** (icône ⚙️ en bas à gauche)
2. Cliquez sur **Database**
3. Faites défiler jusqu'à **Connection string**
4. Sélectionnez **Direct connection** (pas Connection pooling)
5. Copiez l'URL complète qui ressemble à :

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

⚠️ **Important** : Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe dans l'URL !

## Étape 3 : Configurer le fichier .env

1. Créez un fichier `.env` à la racine du projet
2. Copiez le contenu de `env.example`
3. Collez votre DIRECT_URL complète :

```env
DIRECT_URL=postgresql://postgres:votre-mot-de-passe@db.xxxxx.supabase.co:5432/postgres

NODE_ENV=development
PORT=3000
```

⚠️ **Important**: Ne commitez JAMAIS le fichier `.env` (il est déjà dans `.gitignore`)

⚠️ **Important**: Ne commitez JAMAIS le fichier `.env` (il est déjà dans `.gitignore`)

## Étape 4 : Tester la connexion

1. Installez les dépendances :
```bash
npm install
```

2. Démarrez le serveur :
```bash
npm run start:dev
```

3. Si tout fonctionne, vous verrez :
```
🚀 Serveur BI démarré sur http://localhost:3000
📊 API disponible sur http://localhost:3000/api
```

4. Les tables seront créées automatiquement grâce à `synchronize: true` en développement

## Étape 5 : Vérifier les tables dans Supabase

1. Dans Supabase, allez dans **Table Editor** (menu de gauche)
2. Vous devriez voir les tables créées :
   - `cities`
   - `products`
   - `sales`

## 🔒 Sécurité Supabase

### Pour la production :

1. Allez dans **Settings > Database > Connection pooling**
2. Utilisez le **Connection Pooling** pour de meilleures performances
3. Copiez l'URL de pooling (port `6543`)

### Exemple de configuration production avec pooling :

```env
DIRECT_URL=postgresql://postgres.votre-projet:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Note** : Pour la production, vous pouvez utiliser soit Direct connection soit Connection pooling selon vos besoins de performance.

## 🐛 Dépannage

### Erreur : "Connection refused"
- Vérifiez que votre DIRECT_URL est correcte et complète
- Vérifiez que vous avez remplacé `[YOUR-PASSWORD]` par votre vrai mot de passe
- Vérifiez que vous utilisez "Direct connection" et non "Connection pooling" (sauf si vous avez configuré le pooling)

### Erreur : "SSL required"
- Supabase nécessite SSL, c'est déjà configuré dans `app.module.ts` avec `ssl: { rejectUnauthorized: false }`

### Erreur : "Invalid connection string"
- Vérifiez que votre DIRECT_URL commence bien par `postgresql://`
- Vérifiez qu'il n'y a pas d'espaces dans l'URL
- Vérifiez que le mot de passe ne contient pas de caractères spéciaux non encodés (utilisez l'encodage URL si nécessaire)

### Les tables ne se créent pas
- Vérifiez que `synchronize: true` est activé en développement
- Vérifiez les logs du serveur NestJS
- Vérifiez que vous avez les permissions sur la base de données

## 📊 Connexion Power BI

Une fois que tout fonctionne, vous pouvez connecter Power BI :

**Option 1 : Utiliser DIRECT_URL (décomposée)**
1. Extrayez les informations de votre DIRECT_URL :
   - **Host**: `db.xxxxx.supabase.co` (partie après `@` et avant `:`)
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Votre mot de passe Supabase

**Option 2 : Utiliser l'URL complète**
- Certaines versions de Power BI acceptent directement l'URL de connexion PostgreSQL complète

Power BI utilisera la même connexion que votre backend NestJS.

---

**Besoin d'aide ?** Consultez la [documentation Supabase](https://supabase.com/docs/guides/database)

