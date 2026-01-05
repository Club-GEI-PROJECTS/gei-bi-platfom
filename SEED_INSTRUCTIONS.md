# 🌱 Instructions pour le Seed de la Base de Données

## 📋 Qu'est-ce que le seed ?

Le seed est un script qui **peuple automatiquement** votre base de données avec des données initiales réalistes :

- ✅ **26 provinces** de la RDC
- ✅ **24 communes de Kinshasa**
- ✅ **Plus de 100 villes** à travers toute la RDC
- ✅ **80+ produits** de matériaux de construction

## 🚀 Comment exécuter le seed ?

### Étape 1 : Vérifier votre configuration

Assurez-vous que votre fichier `.env` contient votre `DIRECT_URL` Supabase :

```env
DIRECT_URL=postgresql://postgres:votre-mot-de-passe@db.xxxxx.supabase.co:5432/postgres
```

### Étape 2 : Installer les dépendances (si pas déjà fait)

```bash
npm install
```

### Étape 3 : Exécuter le seed

```bash
npm run seed
```

Le script va :
1. Se connecter à votre base Supabase
2. Créer toutes les provinces
3. Créer toutes les villes et communes
4. Créer le catalogue complet de produits

## ✅ Résultat attendu

Vous devriez voir dans la console :

```
🔌 Connexion à la base de données...
✅ Connecté à la base de données

🌱 Début du seed de la base de données...
📦 Création des provinces...
  ✅ Province créée: Kinshasa
  ✅ Province créée: Kongo-Central
  ...
🏙️  Création des villes et communes...
  ✅ 150+ villes/communes créées ou existantes
📦 Création du catalogue produits...
  ✅ 80+ produits créés ou existants

✅ Seed terminé avec succès !
📊 Résumé:
   - 26 provinces
   - 150+ villes/communes
   - 80+ produits
```

## 🔄 Ré-exécuter le seed

Le seed est **idempotent** : vous pouvez l'exécuter plusieurs fois sans problème. Il ne créera que les données qui n'existent pas déjà.

## 📊 Vérifier dans Supabase

1. Allez dans votre projet Supabase
2. Ouvrez **Table Editor**
3. Vérifiez les tables :
   - `provinces` : devrait contenir 26 provinces
   - `cities` : devrait contenir 150+ villes/communes
   - `products` : devrait contenir 80+ produits

## ⚠️ Important

- Le seed doit être exécuté **avant** de lancer le simulateur
- Le seed peut être exécuté plusieurs fois (il ne duplique pas les données)
- Si vous modifiez le seed, vous pouvez le ré-exécuter

## 🐛 Dépannage

### Erreur de connexion
- Vérifiez votre `DIRECT_URL` dans `.env`
- Vérifiez que Supabase est accessible

### Erreur "table does not exist"
- Assurez-vous d'avoir démarré le serveur NestJS au moins une fois pour créer les tables
- Ou activez `synchronize: true` dans `app.module.ts` (déjà activé en dev)

### Données dupliquées
- Le seed est conçu pour éviter les doublons
- Si vous avez des doublons, vous pouvez vider les tables dans Supabase et ré-exécuter le seed

---

**Une fois le seed terminé, vous pouvez lancer le simulateur !** 🚀

