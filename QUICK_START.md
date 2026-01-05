# ⚡ Démarrage rapide

## 🎯 En 5 minutes, vous aurez votre plateforme BI opérationnelle !

### 1️⃣ Configuration Supabase (2 min)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez les infos de connexion (voir `GUIDE_SUPABASE.md`)

### 2️⃣ Configuration Backend (1 min)

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp env.example .env

# Éditer .env avec votre DIRECT_URL Supabase
# (Ouvrez .env et collez votre DIRECT_URL depuis Supabase)
```

### 3️⃣ Démarrer le serveur (30 sec)

```bash
npm run start:dev
```

✅ Vous devriez voir : `🚀 Serveur BI démarré sur http://localhost:3000`

### 4️⃣ Lancer le simulateur (1 min)

```bash
# Dans un nouveau terminal
cd simulator
pip install -r requirements.txt
python sales_simulator.py
```

✅ Le simulateur commence à envoyer des ventes !

### 5️⃣ Vérifier que ça fonctionne (30 sec)

Ouvrez votre navigateur :
- **API Stats**: http://localhost:3000/api/sales/stats
- **Toutes les ventes**: http://localhost:3000/api/sales

Vous devriez voir les données arriver en temps réel !

---

## 📊 Connexion Power BI (optionnel)

1. Ouvrez Power BI Desktop
2. **Obtenir des données** > **PostgreSQL**
3. Entrez vos infos Supabase (même que dans `.env`)
4. Sélectionnez les tables : `sales`, `products`, `cities`
5. Créez vos visualisations !

---

## ✅ Checklist de vérification

- [ ] Projet Supabase créé
- [ ] Fichier `.env` configuré
- [ ] `npm install` exécuté
- [ ] Serveur NestJS démarré (port 3000)
- [ ] Simulateur Python lancé
- [ ] Données visibles dans l'API
- [ ] Tables créées dans Supabase
- [ ] (Optionnel) Power BI connecté

---

## 🐛 Problèmes courants

### Le serveur ne démarre pas
- Vérifiez que le port 3000 n'est pas utilisé
- Vérifiez votre fichier `.env`
- Vérifiez la connexion Supabase

### Le simulateur ne fonctionne pas
- Vérifiez que le serveur NestJS est démarré
- Vérifiez l'URL dans `sales_simulator.py` (par défaut: `http://localhost:3000/api/sales`)

### Pas de données dans Supabase
- Attendez quelques secondes (le simulateur envoie toutes les 2-15 secondes)
- Vérifiez les logs du simulateur
- Vérifiez les logs du serveur NestJS

---

**C'est parti ! 🚀**

