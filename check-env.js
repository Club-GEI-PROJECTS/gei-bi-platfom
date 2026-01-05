/**
 * Script de vérification de la configuration .env
 * Utilisez : node check-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

console.log('🔍 Vérification de la configuration...\n');

// Vérifier si .env existe
if (!fs.existsSync(envPath)) {
  console.error('❌ Le fichier .env n\'existe pas !');
  console.log('\n📝 Solution :');
  console.log('1. Copiez env.example vers .env :');
  console.log('   cp env.example .env');
  console.log('2. Éditez .env et remplissez DIRECT_URL avec votre URL Supabase');
  process.exit(1);
}

// Lire le fichier .env
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Vérifier DIRECT_URL
let hasDirectUrl = false;
let directUrlValue = '';

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DIRECT_URL=')) {
    hasDirectUrl = true;
    directUrlValue = trimmed.substring('DIRECT_URL='.length);
    break;
  }
}

if (!hasDirectUrl || !directUrlValue) {
  console.error('❌ DIRECT_URL n\'est pas défini dans .env');
  console.log('\n📝 Ajoutez cette ligne dans .env :');
  console.log('DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres');
  console.log('\n⚠️  Remplacez [YOUR-PASSWORD] par votre vrai mot de passe Supabase');
  process.exit(1);
}

// Vérifier le format de l'URL
if (!directUrlValue.startsWith('postgresql://')) {
  console.error('❌ DIRECT_URL ne commence pas par postgresql://');
  console.log('\n📝 Format attendu :');
  console.log('postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]');
  process.exit(1);
}

// Vérifier si le mot de passe placeholder est toujours là
if (directUrlValue.includes('[YOUR-PASSWORD]')) {
  console.error('❌ Vous devez remplacer [YOUR-PASSWORD] par votre vrai mot de passe');
  console.log('\n📝 Dans Supabase :');
  console.log('1. Allez dans Settings > Database');
  console.log('2. Copiez la connection string');
  console.log('3. Remplacez [YOUR-PASSWORD] par votre mot de passe');
  process.exit(1);
}

// Extraire les informations de l'URL pour vérification
try {
  const url = new URL(directUrlValue);
  console.log('✅ Configuration trouvée :');
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432'}`);
  console.log(`   Database: ${url.pathname.substring(1)}`);
  console.log(`   User: ${url.username}`);
  console.log(`   Password: ${url.password ? '***' : 'NON DÉFINI'}`);
  console.log('\n✅ Le fichier .env semble correctement configuré !');
  console.log('\n💡 Si vous avez toujours des erreurs de connexion :');
  console.log('   - Vérifiez que votre mot de passe est correct');
  console.log('   - Vérifiez que votre projet Supabase est actif');
  console.log('   - Consultez TROUBLESHOOTING.md pour plus d\'aide');
} catch (error) {
  console.error('❌ L\'URL DIRECT_URL n\'est pas valide');
  console.error(`   Erreur: ${error.message}`);
  process.exit(1);
}

