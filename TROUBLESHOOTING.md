# 🔧 Guide de Dépannage

## ❌ Erreur : `ECONNREFUSED` - Unable to connect to the database

Cette erreur signifie que NestJS ne peut pas se connecter à votre base de données Supabase.

### ✅ Solutions étape par étape

#### 1. Vérifier que le fichier `.env` existe

```bash
# À la racine du projet, vérifiez que le fichier .env existe
ls -la .env

# Si le fichier n'existe pas, créez-le :
cp env.example .env
```

#### 2. Vérifier le contenu du fichier `.env`

Ouvrez le fichier `.env` et vérifiez qu'il contient :

```env
DIRECT_URL=postgresql://postgres:votre-mot-de-passe@db.xxxxx.supabase.co:5432/postgres
NODE_ENV=development
PORT=3000
```

⚠️ **Points importants** :
- Remplacez `[YOUR-PASSWORD]` par votre **vrai mot de passe Supabase**
- Remplacez `db.xxxxx.supabase.co` par votre **vrai host Supabase**
- Il ne doit **PAS y avoir d'espaces** autour du `=`
- L'URL doit être sur **une seule ligne**

#### 3. Récupérer la bonne DIRECT_URL depuis Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** (⚙️ en bas à gauche)
4. Cliquez sur **Database**
5. Faites défiler jusqu'à **Connection string**
6. Sélectionnez **Direct connection** (pas Connection pooling)
7. Copiez l'URL complète

L'URL devrait ressembler à :
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxxx-x.pooler.supabase.com:6543/postgres
```

OU (selon votre configuration) :
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### 4. Encoder le mot de passe si nécessaire

Si votre mot de passe contient des caractères spéciaux (`@`, `#`, `%`, `&`, etc.), vous devez les encoder en URL.

**Exemple** :
- Mot de passe : `Mon@Mot#DePasse123`
- Encodé : `Mon%40Mot%23DePasse123`

**Outils pour encoder** :
- [URL Encoder](https://www.urlencoder.org/)
- Ou utilisez `encodeURIComponent()` en JavaScript

**Exemple complet** :
```env
# Mot de passe original : Mon@Mot#DePasse123
DIRECT_URL=postgresql://postgres:Mon%40Mot%23DePasse123@db.xxxxx.supabase.co:5432/postgres
```

#### 5. Vérifier la connexion internet

Assurez-vous que votre connexion internet fonctionne et que vous pouvez accéder à Supabase.

#### 6. Vérifier que le projet Supabase est actif

1. Allez sur votre dashboard Supabase
2. Vérifiez que le projet n'est pas en pause
3. Si le projet est en pause, réactivez-le

#### 7. Tester la connexion manuellement

Vous pouvez tester la connexion avec `psql` ou un client PostgreSQL :

```bash
# Avec psql (si installé)
psql "postgresql://postgres:votre-mot-de-passe@db.xxxxx.supabase.co:5432/postgres"
```

Ou utilisez un client graphique comme :
- [pgAdmin](https://www.pgadmin.org/)
- [DBeaver](https://dbeaver.io/)
- [TablePlus](https://tableplus.com/)

#### 8. Vérifier les logs détaillés

Modifiez temporairement `src/app.module.ts` pour activer les logs :

```typescript
logging: true, // Au lieu de 'development'
```

Cela vous donnera plus d'informations sur l'erreur.

### 🔍 Checklist rapide

- [ ] Le fichier `.env` existe à la racine du projet
- [ ] `DIRECT_URL` est défini dans `.env`
- [ ] Le mot de passe dans l'URL est le bon
- [ ] Les caractères spéciaux du mot de passe sont encodés
- [ ] L'URL est sur une seule ligne (pas de saut de ligne)
- [ ] Vous utilisez "Direct connection" et non "Connection pooling"
- [ ] Votre projet Supabase est actif
- [ ] Votre connexion internet fonctionne

### 💡 Solution alternative : Utiliser les variables séparées

Si l'URL complète pose problème, vous pouvez décomposer la connexion :

Modifiez `src/app.module.ts` :

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Province, City, Product, Sale],
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: {
    rejectUnauthorized: false,
  },
  logging: process.env.NODE_ENV === 'development',
}),
```

Et dans `.env` :

```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe
DB_NAME=postgres
```

### 📞 Besoin d'aide supplémentaire ?

Si le problème persiste :
1. Vérifiez les [logs Supabase](https://supabase.com/dashboard/project/_/logs)
2. Consultez la [documentation Supabase](https://supabase.com/docs/guides/database)
3. Vérifiez que votre projet n'a pas atteint ses limites (plan gratuit)

---

## Autres erreurs courantes

### Erreur : "password authentication failed"
- Vérifiez que le mot de passe est correct
- Vérifiez que vous utilisez le bon utilisateur (généralement `postgres`)

### Erreur : "SSL required"
- La configuration SSL est déjà dans le code
- Vérifiez que `ssl: { rejectUnauthorized: false }` est présent

### Erreur : "relation does not exist"
- Exécutez `npm run seed` pour créer les tables
- Ou vérifiez que `synchronize: true` est activé en développement

