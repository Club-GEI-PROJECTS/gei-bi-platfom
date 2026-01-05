import { DataSource } from 'typeorm';
import { Province } from '../entities/province.entity';
import { City } from '../entities/city.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { PaymentMethod } from '../entities/payment-method.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Payment } from '../entities/payment.entity';

// Toutes les provinces de la RDC
const provinces = [
  { name: 'Kinshasa', code: 'KIN' },
  { name: 'Kongo-Central', code: 'KON' },
  { name: 'Kwilu', code: 'KWI' },
  { name: 'Kwilu-Ngongo', code: 'KWN' },
  { name: 'Mai-Ndombe', code: 'MND' },
  { name: 'Kasaï', code: 'KAS' },
  { name: 'Kasaï-Central', code: 'KAC' },
  { name: 'Kasaï-Oriental', code: 'KAO' },
  { name: 'Lomami', code: 'LOM' },
  { name: 'Sankuru', code: 'SAN' },
  { name: 'Maniema', code: 'MAN' },
  { name: 'Sud-Kivu', code: 'SKI' },
  { name: 'Nord-Kivu', code: 'NKI' },
  { name: 'Ituri', code: 'ITU' },
  { name: 'Haut-Uélé', code: 'HUE' },
  { name: 'Bas-Uélé', code: 'BUE' },
  { name: 'Tshopo', code: 'TSH' },
  { name: 'Tshuapa', code: 'TSA' },
  { name: 'Équateur', code: 'EQU' },
  { name: 'Mongala', code: 'MON' },
  { name: 'Nord-Ubangi', code: 'NUB' },
  { name: 'Sud-Ubangi', code: 'SUB' },
  { name: 'Haut-Katanga', code: 'HKA' },
  { name: 'Lualaba', code: 'LUA' },
  { name: 'Haut-Lomami', code: 'HLO' },
  { name: 'Tanganyika', code: 'TAN' },
];

// Toutes les communes de Kinshasa (24 communes)
const kinshasaCommunes = [
  'Bandalungwa',
  'Barumbu',
  'Bumbu',
  'Gombe',
  'Kalamu',
  'Kasa-Vubu',
  'Kimbanseke',
  'Kinshasa',
  'Kintambo',
  'Kisenso',
  'Lemba',
  'Limete',
  'Lingwala',
  'Makala',
  'Maluku',
  'Masina',
  'Matete',
  'Mont-Ngafula',
  'Ndjili',
  'Ngaba',
  'Ngaliema',
  'Ngiri-Ngiri',
  'Nsele',
  'Selembao',
];

// Principales villes de la RDC par province
const citiesByProvince: Record<string, string[]> = {
  'Kinshasa': kinshasaCommunes,
  'Kongo-Central': ['Matadi', 'Boma', 'Muanda', 'Kisantu', 'Mbanza-Ngungu', 'Lukula'],
  'Kwilu': ['Bandundu', 'Kikwit', 'Bulungu', 'Gungu', 'Idiofa', 'Masi-Manimba'],
  'Kwilu-Ngongo': ['Kwilu-Ngongo', 'Mangai', 'Kutu'],
  'Mai-Ndombe': ['Inongo', 'Kutu', 'Oshwe', 'Kiri'],
  'Kasaï': ['Luebo', 'Dekese', 'Ilebo'],
  'Kasaï-Central': ['Kananga', 'Lubao', 'Luiza', 'Mwene-Ditu'],
  'Kasaï-Oriental': ['Mbuji-Mayi', 'Mwene-Ditu', 'Lubao', 'Tshilenge'],
  'Lomami': ['Kabinda', 'Mwene-Ditu', 'Ngandajika'],
  'Sankuru': ['Lusambo', 'Lodja', 'Lomela'],
  'Maniema': ['Kindu', 'Kasongo', 'Kibombo'],
  'Sud-Kivu': ['Bukavu', 'Uvira', 'Baraka', 'Fizi', 'Shabunda', 'Mwenga'],
  'Nord-Kivu': ['Goma', 'Beni', 'Butembo', 'Rutshuru', 'Masisi', 'Walikale'],
  'Ituri': ['Bunia', 'Aru', 'Mahagi', 'Mambasa'],
  'Haut-Uélé': ['Isiro', 'Wamba', 'Niangara', 'Dungu'],
  'Bas-Uélé': ['Buta', 'Aketi', 'Bondo'],
  'Tshopo': ['Kisangani', 'Ubundu', 'Yahuma', 'Bafwasende'],
  'Tshuapa': ['Boende', 'Djolu', 'Befale'],
  'Équateur': ['Mbandaka', 'Gemena', 'Lisala', 'Bikoro'],
  'Mongala': ['Lisala', 'Bumba', 'Bongandanga'],
  'Nord-Ubangi': ['Gbadolite', 'Bosobolo', 'Mobayi-Mbongo'],
  'Sud-Ubangi': ['Gemena', 'Libenge', 'Zongo'],
  'Haut-Katanga': ['Lubumbashi', 'Likasi', 'Kipushi', 'Kakanda', 'Kasumbalesa'],
  'Lualaba': ['Kolwezi', 'Likasi', 'Musoshi', 'Kambove'],
  'Haut-Lomami': ['Kamina', 'Kabongo', 'Malemba-Nkulu'],
  'Tanganyika': ['Kalemie', 'Kongolo', 'Manono', 'Moba'],
};

// Catalogue complet de produits de matériaux de construction
const products = [
  // CIMENT
  { name: 'Ciment Portland 50kg', category: 'Ciment', unit: 'sac' },
  { name: 'Ciment Portland 25kg', category: 'Ciment', unit: 'sac' },
  { name: 'Ciment gris 50kg', category: 'Ciment', unit: 'sac' },
  { name: 'Ciment blanc 50kg', category: 'Ciment', unit: 'sac' },
  
  // ACIER / FER À BÉTON
  { name: 'Fer à béton 6mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 8mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 10mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 12mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 14mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 16mm', category: 'Acier', unit: 'barre' },
  { name: 'Fer à béton 20mm', category: 'Acier', unit: 'barre' },
  { name: 'Treillis soudé 6mm', category: 'Acier', unit: 'm²' },
  { name: 'Fil de fer noir', category: 'Acier', unit: 'rouleau' },
  
  // GRANULATS
  { name: 'Sable fin (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Sable de rivière (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Gravier 5/15 (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Gravier 15/25 (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Gravier 25/40 (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Pierre concassée (m³)', category: 'Granulat', unit: 'm³' },
  { name: 'Laterite (m³)', category: 'Granulat', unit: 'm³' },
  
  // BRIQUES ET PARPAINGS
  { name: 'Brique rouge standard', category: 'Maçonnerie', unit: 'unité' },
  { name: 'Brique rouge pleine', category: 'Maçonnerie', unit: 'unité' },
  { name: 'Parpaing creux 20x20x40', category: 'Maçonnerie', unit: 'unité' },
  { name: 'Parpaing creux 15x20x40', category: 'Maçonnerie', unit: 'unité' },
  { name: 'Parpaing plein 20x20x40', category: 'Maçonnerie', unit: 'unité' },
  { name: 'Agglo creux 20x20x40', category: 'Maçonnerie', unit: 'unité' },
  
  // COUVERTURE
  { name: 'Tôle ondulée galvanisée', category: 'Couverture', unit: 'm²' },
  { name: 'Tôle ondulée prélaquée', category: 'Couverture', unit: 'm²' },
  { name: 'Tôle trapézoïdale', category: 'Couverture', unit: 'm²' },
  { name: 'Tuile métallique', category: 'Couverture', unit: 'm²' },
  { name: 'Bardeau bitumineux', category: 'Couverture', unit: 'm²' },
  
  // FINITION
  { name: 'Peinture blanche 20L', category: 'Finition', unit: 'bidon' },
  { name: 'Peinture blanche 10L', category: 'Finition', unit: 'bidon' },
  { name: 'Peinture blanche 5L', category: 'Finition', unit: 'bidon' },
  { name: 'Peinture couleur 20L', category: 'Finition', unit: 'bidon' },
  { name: 'Peinture couleur 10L', category: 'Finition', unit: 'bidon' },
  { name: 'Peinture anti-rouille', category: 'Finition', unit: 'bidon' },
  { name: 'Enduit extérieur 25kg', category: 'Finition', unit: 'sac' },
  { name: 'Enduit intérieur 25kg', category: 'Finition', unit: 'sac' },
  { name: 'Carreau céramique 30x30', category: 'Finition', unit: 'm²' },
  { name: 'Carreau céramique 40x40', category: 'Finition', unit: 'm²' },
  { name: 'Carreau céramique 60x60', category: 'Finition', unit: 'm²' },
  { name: 'Carrelage grès cérame', category: 'Finition', unit: 'm²' },
  
  // MENUISERIE
  { name: 'Porte métallique standard', category: 'Menuiserie', unit: 'unité' },
  { name: 'Porte métallique blindée', category: 'Menuiserie', unit: 'unité' },
  { name: 'Porte en bois massif', category: 'Menuiserie', unit: 'unité' },
  { name: 'Fenêtre PVC simple vitrage', category: 'Menuiserie', unit: 'unité' },
  { name: 'Fenêtre PVC double vitrage', category: 'Menuiserie', unit: 'unité' },
  { name: 'Fenêtre aluminium', category: 'Menuiserie', unit: 'unité' },
  { name: 'Battant de fenêtre', category: 'Menuiserie', unit: 'unité' },
  
  // PLOMBERIE
  { name: 'Tuyau PVC 20mm', category: 'Plomberie', unit: 'mètre' },
  { name: 'Tuyau PVC 25mm', category: 'Plomberie', unit: 'mètre' },
  { name: 'Tuyau PVC 32mm', category: 'Plomberie', unit: 'mètre' },
  { name: 'Tuyau PVC 40mm', category: 'Plomberie', unit: 'mètre' },
  { name: 'Tuyau PVC 50mm', category: 'Plomberie', unit: 'mètre' },
  { name: 'Raccord PVC 20mm', category: 'Plomberie', unit: 'unité' },
  { name: 'Raccord PVC 25mm', category: 'Plomberie', unit: 'unité' },
  { name: 'Robinet mélangeur', category: 'Plomberie', unit: 'unité' },
  { name: 'Robinet simple', category: 'Plomberie', unit: 'unité' },
  
  // ÉLECTRICITÉ
  { name: 'Câble électrique 1.5mm²', category: 'Électricité', unit: 'mètre' },
  { name: 'Câble électrique 2.5mm²', category: 'Électricité', unit: 'mètre' },
  { name: 'Câble électrique 4mm²', category: 'Électricité', unit: 'mètre' },
  { name: 'Câble électrique 6mm²', category: 'Électricité', unit: 'mètre' },
  { name: 'Interrupteur simple', category: 'Électricité', unit: 'unité' },
  { name: 'Interrupteur double', category: 'Électricité', unit: 'unité' },
  { name: 'Prise électrique', category: 'Électricité', unit: 'unité' },
  { name: 'Ampoule LED 12W', category: 'Électricité', unit: 'unité' },
  { name: 'Ampoule LED 20W', category: 'Électricité', unit: 'unité' },
  
  // AUTRES
  { name: 'Clou de construction', category: 'Quincaillerie', unit: 'kg' },
  { name: 'Vis à bois', category: 'Quincaillerie', unit: 'kg' },
  { name: 'Vis à métal', category: 'Quincaillerie', unit: 'kg' },
  { name: 'Cheville plastique', category: 'Quincaillerie', unit: 'unité' },
  { name: 'Colle à carrelage 25kg', category: 'Colles', unit: 'sac' },
  { name: 'Mastic silicone', category: 'Colles', unit: 'tube' },
];

// Méthodes de paiement
const paymentMethods = [
  { name: 'Espèces', description: 'Paiement en espèces sur place', requiresOnline: false },
  { name: 'Carte bancaire', description: 'Paiement par carte bancaire (Visa, Mastercard)', requiresOnline: true },
  { name: 'Mobile Money', description: 'Paiement via Mobile Money (Airtel Money, Orange Money, M-Pesa)', requiresOnline: true },
  { name: 'Virement bancaire', description: 'Virement bancaire', requiresOnline: true },
  { name: 'Chèque', description: 'Paiement par chèque', requiresOnline: false },
  { name: 'Traite', description: 'Paiement par traite', requiresOnline: false },
];

// Prénoms et noms congolais pour générer des clients réalistes
const firstNames = [
  'Jean', 'Pierre', 'Paul', 'Joseph', 'André', 'Michel', 'Philippe', 'David', 'Daniel', 'Marc',
  'Marie', 'Catherine', 'Françoise', 'Anne', 'Sylvie', 'Isabelle', 'Martine', 'Nathalie', 'Sophie', 'Julie',
  'Koffi', 'Moussa', 'Amadou', 'Ibrahim', 'Ousmane', 'Mamadou', 'Abdoulaye', 'Mohamed', 'Ali', 'Hassan',
  'Fatou', 'Aissatou', 'Mariam', 'Aminata', 'Kadiatou', 'Awa', 'Rokhaya', 'Ndeye', 'Aissata', 'Maimouna',
];

const lastNames = [
  'Kabila', 'Tshisekedi', 'Lumumba', 'Mobutu', 'Kasa-Vubu', 'Mukamba', 'Kalombo', 'Mputu', 'Kazadi', 'Mbuyi',
  'Ngalula', 'Mpiana', 'Tshala', 'Mwanza', 'Kankonde', 'Mulumba', 'Kibamba', 'Mukendi', 'Kalala', 'Mputu',
  'Diallo', 'Ba', 'Ndiaye', 'Sall', 'Diop', 'Fall', 'Seck', 'Gueye', 'Sy', 'Kane',
  'Traoré', 'Konaté', 'Coulibaly', 'Sangaré', 'Diarra', 'Keita', 'Touré', 'Cissé', 'Dembélé', 'Sidibé',
];

// Noms d'entreprises réalistes
const companyNames = [
  'Construction Kabila SARL', 'BTP Congo', 'Matériaux Express', 'Bâtiment Plus', 'Construction Moderne',
  'Entreprise Générale de Construction', 'BTP Excellence', 'Matériaux Premium', 'Construction Pro', 'BTP Kinshasa',
  'Groupe Construction RDC', 'Bâtiment & Co', 'Matériaux Express RDC', 'Construction Elite', 'BTP Solutions',
];

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Début du seed de la base de données...');

  const provinceRepository = dataSource.getRepository(Province);
  const cityRepository = dataSource.getRepository(City);
  const productRepository = dataSource.getRepository(Product);

  try {
    // 1. Créer les provinces
    console.log('📦 Création des provinces...');
    const createdProvinces: Record<string, Province> = {};
    
    for (const prov of provinces) {
      let province = await provinceRepository.findOne({ where: { name: prov.name } });
      if (!province) {
        province = provinceRepository.create({
          name: prov.name,
          code: prov.code,
        });
        province = await provinceRepository.save(province);
        console.log(`  ✅ Province créée: ${prov.name}`);
      }
      createdProvinces[prov.name] = province;
    }

    // 2. Créer les villes
    console.log('🏙️  Création des villes et communes...');
    let totalCities = 0;

    for (const [provinceName, cityNames] of Object.entries(citiesByProvince)) {
      const province = createdProvinces[provinceName];
      if (!province) {
        console.warn(`  ⚠️  Province non trouvée: ${provinceName}`);
        continue;
      }

      for (const cityName of cityNames) {
        let city = await cityRepository.findOne({
          where: { name: cityName, provinceId: province.id },
        });

        if (!city) {
          const isCommune = provinceName === 'Kinshasa';
          city = cityRepository.create({
            name: cityName,
            type: isCommune ? 'commune' : 'ville',
            provinceId: province.id,
          });
          city = await cityRepository.save(city);
          totalCities++;
        }
      }
    }

    console.log(`  ✅ ${totalCities} villes/communes créées ou existantes`);

    // 3. Créer les produits
    console.log('📦 Création du catalogue produits...');
    let totalProducts = 0;

    for (const prod of products) {
      let product = await productRepository.findOne({ where: { name: prod.name } });
      if (!product) {
        product = productRepository.create({
          name: prod.name,
          category: prod.category,
        });
        product = await productRepository.save(product);
        totalProducts++;
      }
    }

    console.log(`  ✅ ${totalProducts} produits créés ou existants`);

    // 4. Créer les méthodes de paiement
    console.log('💳 Création des méthodes de paiement...');
    const paymentMethodRepository = dataSource.getRepository(PaymentMethod);
    const createdPaymentMethods: Record<string, PaymentMethod> = {};
    
    for (const pm of paymentMethods) {
      let paymentMethod = await paymentMethodRepository.findOne({ where: { name: pm.name } });
      if (!paymentMethod) {
        paymentMethod = paymentMethodRepository.create({
          name: pm.name,
          description: pm.description,
          requiresOnline: pm.requiresOnline,
          isActive: true,
        });
        paymentMethod = await paymentMethodRepository.save(paymentMethod);
        console.log(`  ✅ Méthode de paiement créée: ${pm.name}`);
      }
      createdPaymentMethods[pm.name] = paymentMethod;
    }

    // 5. Créer des clients
    console.log('👥 Création des clients...');
    const customerRepository = dataSource.getRepository(Customer);
    const allCities = await cityRepository.find();
    const createdCustomers: Customer[] = [];
    
    // Créer 200 clients variés
    for (let i = 0; i < 200; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const city = allCities[Math.floor(Math.random() * allCities.length)];
      const customerType = Math.random() < 0.4 ? 'particulier' : 
                          Math.random() < 0.7 ? 'entreprise' : 
                          Math.random() < 0.9 ? 'entrepreneur' : 'gouvernement';
      
      const phone = `+243${Math.floor(900000000 + Math.random() * 99999999)}`;
      const email = customerType === 'particulier' ? 
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com` : 
        `contact@${companyNames[Math.floor(Math.random() * companyNames.length)].toLowerCase().replace(/\s+/g, '')}.cd`;
      
      const customer = customerRepository.create({
        firstName,
        lastName,
        phone,
        email: Math.random() < 0.7 ? email : null, // 70% ont un email
        customerType,
        companyName: customerType !== 'particulier' ? companyNames[Math.floor(Math.random() * companyNames.length)] : null,
        address: `Avenue ${Math.floor(Math.random() * 100)}, ${city.name}`,
        cityId: city.id,
        taxId: customerType !== 'particulier' ? `T${Math.floor(1000000 + Math.random() * 8999999)}` : null,
        isActive: Math.random() < 0.95, // 95% actifs
        totalSpent: 0,
        totalOrders: 0,
      });
      
      const savedCustomer = await customerRepository.save(customer);
      createdCustomers.push(savedCustomer);
    }
    
    console.log(`  ✅ ${createdCustomers.length} clients créés`);

    // 6. Créer des commandes avec items et paiements
    console.log('📦 Création des commandes...');
    const orderRepository = dataSource.getRepository(Order);
    const orderItemRepository = dataSource.getRepository(OrderItem);
    const paymentRepository = dataSource.getRepository(Payment);
    const allProducts = await productRepository.find();
    
    let orderCounter = 1;
    const statuses = ['en_attente', 'confirmée', 'en_traitement', 'expédiée', 'livrée', 'annulée'];
    const paymentStatuses = ['en_attente', 'complété', 'échoué'];
    
    // Créer 500 commandes
    for (let i = 0; i < 500; i++) {
      const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const deliveryCity = allCities[Math.floor(Math.random() * allCities.length)];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 365)); // Commandes sur les 12 derniers mois
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const numItems = Math.floor(Math.random() * 5) + 1; // 1 à 5 produits par commande
      
      // Calculer les montants
      let subtotal = 0;
      const items: OrderItem[] = [];
      
      for (let j = 0; j < numItems; j++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const quantity = Math.floor(Math.random() * 50) + 1;
        
        // Prix réalistes selon le produit
        let unitPrice = 10;
        if (product.name.includes('Ciment')) unitPrice = Math.random() * 10 + 10;
        else if (product.name.includes('Fer')) unitPrice = Math.random() * 20 + 15;
        else if (product.name.includes('Sable') || product.name.includes('Gravier')) unitPrice = Math.random() * 20 + 25;
        else if (product.name.includes('Peinture')) unitPrice = Math.random() * 30 + 20;
        else if (product.name.includes('Porte')) unitPrice = Math.random() * 200 + 150;
        else if (product.name.includes('Fenêtre')) unitPrice = Math.random() * 150 + 80;
        else unitPrice = Math.random() * 50 + 5;
        
        const totalPrice = quantity * unitPrice;
        subtotal += totalPrice;
        
        items.push({
          productId: product.id,
          quantity,
          unitPrice,
          totalPrice,
        } as OrderItem);
      }
      
      const tax = subtotal * 0.16; // 16% de TVA
      const shippingCost = subtotal > 1000 ? 0 : Math.random() * 50 + 20; // Frais de livraison si < 1000
      const totalAmount = subtotal + tax + shippingCost;
      
      const orderNumber = `CMD-${new Date().getFullYear()}-${String(orderCounter).padStart(6, '0')}`;
      orderCounter++;
      
      const order = orderRepository.create({
        orderNumber,
        customerId: customer.id,
        deliveryCityId: deliveryCity.id,
        deliveryAddress: `Avenue ${Math.floor(Math.random() * 100)}, ${deliveryCity.name}`,
        status,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        orderDate,
        deliveryDate: status === 'livrée' || status === 'expédiée' ? 
          new Date(orderDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        completedDate: status === 'livrée' ? 
          new Date(orderDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
        notes: Math.random() < 0.3 ? 'Livraison urgente' : null,
      });
      
      const savedOrder = await orderRepository.save(order);
      
      // Créer les items de commande
      for (const item of items) {
        const orderItem = orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
        await orderItemRepository.save(orderItem);
      }
      
      // Créer le paiement
      const paymentMethod = Object.values(createdPaymentMethods)[
        Math.floor(Math.random() * Object.keys(createdPaymentMethods).length)
      ];
      const paymentStatus = status === 'annulée' ? 'échoué' : 
                           status === 'livrée' || status === 'expédiée' ? 'complété' : 
                           paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const payment = paymentRepository.create({
        transactionId,
        orderId: savedOrder.id,
        paymentMethodId: paymentMethod.id,
        amount: totalAmount,
        status: paymentStatus,
        paymentDate: paymentStatus === 'complété' ? orderDate : null,
        reference: paymentMethod.requiresOnline ? 
          `${paymentMethod.name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000000)}` : null,
      });
      await paymentRepository.save(payment);
      
      // Mettre à jour les stats du client
      if (paymentStatus === 'complété') {
        const customerRepo = dataSource.getRepository(Customer);
        const customerToUpdate = await customerRepo.findOne({ where: { id: customer.id } });
        if (customerToUpdate) {
          customerToUpdate.totalSpent = (parseFloat(customerToUpdate.totalSpent.toString()) || 0) + totalAmount;
          customerToUpdate.totalOrders = (customerToUpdate.totalOrders || 0) + 1;
          await customerRepo.save(customerToUpdate);
        }
      }
    }
    
    console.log(`  ✅ 500 commandes créées avec items et paiements`);

    console.log('\n✅ Seed terminé avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${provinces.length} provinces`);
    console.log(`   - ${totalCities} villes/communes`);
    console.log(`   - ${totalProducts} produits`);
    console.log(`   - ${paymentMethods.length} méthodes de paiement`);
    console.log(`   - ${createdCustomers.length} clients`);
    console.log(`   - 500 commandes avec items et paiements`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  }
}

