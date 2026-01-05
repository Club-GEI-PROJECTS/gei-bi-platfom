"""
Simulateur de commandes pour la plateforme BI du Club GEI
Simule des commandes complètes avec clients, items et paiements
"""

import requests
import random
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('simulator.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Configuration
API_BASE = "http://localhost:3000/api"

# Prénoms et noms congolais
FIRST_NAMES = [
    'Jean', 'Pierre', 'Paul', 'Joseph', 'André', 'Michel', 'Philippe', 'David', 'Daniel', 'Marc',
    'Marie', 'Catherine', 'Françoise', 'Anne', 'Sylvie', 'Isabelle', 'Martine', 'Nathalie', 'Sophie', 'Julie',
    'Koffi', 'Moussa', 'Amadou', 'Ibrahim', 'Ousmane', 'Mamadou', 'Abdoulaye', 'Mohamed', 'Ali', 'Hassan',
    'Fatou', 'Aissatou', 'Mariam', 'Aminata', 'Kadiatou', 'Awa', 'Rokhaya', 'Ndeye', 'Aissata', 'Maimouna',
]

LAST_NAMES = [
    'Kabila', 'Tshisekedi', 'Lumumba', 'Mobutu', 'Kasa-Vubu', 'Mukamba', 'Kalombo', 'Mputu', 'Kazadi', 'Mbuyi',
    'Ngalula', 'Mpiana', 'Tshala', 'Mwanza', 'Kankonde', 'Mulumba', 'Kibamba', 'Mukendi', 'Kalala', 'Mputu',
    'Diallo', 'Ba', 'Ndiaye', 'Sall', 'Diop', 'Fall', 'Seck', 'Gueye', 'Sy', 'Kane',
    'Traoré', 'Konaté', 'Coulibaly', 'Sangaré', 'Diarra', 'Keita', 'Touré', 'Cissé', 'Dembélé', 'Sidibé',
]

COMPANY_NAMES = [
    'Construction Kabila SARL', 'BTP Congo', 'Matériaux Express', 'Bâtiment Plus', 'Construction Moderne',
    'Entreprise Générale de Construction', 'BTP Excellence', 'Matériaux Premium', 'Construction Pro', 'BTP Kinshasa',
    'Groupe Construction RDC', 'Bâtiment & Co', 'Matériaux Express RDC', 'Construction Elite', 'BTP Solutions',
]

# Méthodes de paiement
PAYMENT_METHODS = [
    'Espèces', 'Carte bancaire', 'Mobile Money', 'Virement bancaire', 'Chèque', 'Traite'
]

# Statuts de commande
ORDER_STATUSES = ['en_attente', 'confirmée', 'en_traitement', 'expédiée', 'livrée', 'annulée']

# Statuts de paiement
PAYMENT_STATUSES = ['en_attente', 'complété', 'échoué']

# Catalogue de produits avec prix réalistes
PRODUCTS: List[Dict[str, any]] = [
    # CIMENT
    {"name": "Ciment Portland 50kg", "price_range": (12, 18), "category": "Ciment", "quantity_range": (1, 100)},
    {"name": "Ciment Portland 25kg", "price_range": (6, 10), "category": "Ciment", "quantity_range": (1, 150)},
    {"name": "Ciment gris 50kg", "price_range": (11, 17), "category": "Ciment", "quantity_range": (1, 100)},
    {"name": "Ciment blanc 50kg", "price_range": (15, 22), "category": "Ciment", "quantity_range": (1, 50)},
    
    # ACIER
    {"name": "Fer à béton 6mm", "price_range": (8, 12), "category": "Acier", "quantity_range": (10, 200)},
    {"name": "Fer à béton 8mm", "price_range": (10, 15), "category": "Acier", "quantity_range": (10, 200)},
    {"name": "Fer à béton 10mm", "price_range": (15, 22), "category": "Acier", "quantity_range": (5, 150)},
    {"name": "Fer à béton 12mm", "price_range": (18, 25), "category": "Acier", "quantity_range": (5, 120)},
    {"name": "Fer à béton 16mm", "price_range": (25, 35), "category": "Acier", "quantity_range": (5, 80)},
    
    # GRANULATS
    {"name": "Sable fin (m³)", "price_range": (25, 40), "category": "Granulat", "quantity_range": (1, 20)},
    {"name": "Sable de rivière (m³)", "price_range": (20, 35), "category": "Granulat", "quantity_range": (1, 25)},
    {"name": "Gravier 5/15 (m³)", "price_range": (30, 45), "category": "Granulat", "quantity_range": (1, 20)},
    {"name": "Gravier 15/25 (m³)", "price_range": (35, 50), "category": "Granulat", "quantity_range": (1, 15)},
    
    # MAÇONNERIE
    {"name": "Brique rouge standard", "price_range": (0.3, 0.8), "category": "Maçonnerie", "quantity_range": (50, 2000)},
    {"name": "Parpaing creux 20x20x40", "price_range": (0.8, 1.5), "category": "Maçonnerie", "quantity_range": (20, 1000)},
    
    # COUVERTURE
    {"name": "Tôle ondulée galvanisée", "price_range": (8, 15), "category": "Couverture", "quantity_range": (5, 200)},
    {"name": "Tôle ondulée prélaquée", "price_range": (10, 18), "category": "Couverture", "quantity_range": (5, 150)},
    
    # FINITION
    {"name": "Peinture blanche 20L", "price_range": (35, 55), "category": "Finition", "quantity_range": (1, 30)},
    {"name": "Peinture couleur 20L", "price_range": (40, 65), "category": "Finition", "quantity_range": (1, 25)},
    {"name": "Carreau céramique 30x30", "price_range": (8, 15), "category": "Finition", "quantity_range": (5, 200)},
    
    # MENUISERIE
    {"name": "Porte métallique standard", "price_range": (150, 280), "category": "Menuiserie", "quantity_range": (1, 10)},
    {"name": "Fenêtre PVC simple vitrage", "price_range": (80, 150), "category": "Menuiserie", "quantity_range": (1, 15)},
    
    # PLOMBERIE
    {"name": "Tuyau PVC 20mm", "price_range": (2, 4), "category": "Plomberie", "quantity_range": (5, 100)},
    {"name": "Tuyau PVC 25mm", "price_range": (2.5, 5), "category": "Plomberie", "quantity_range": (5, 100)},
    {"name": "Robinet mélangeur", "price_range": (25, 50), "category": "Plomberie", "quantity_range": (1, 20)},
    
    # ÉLECTRICITÉ
    {"name": "Câble électrique 2.5mm²", "price_range": (1.5, 3.5), "category": "Électricité", "quantity_range": (10, 400)},
    {"name": "Câble électrique 4mm²", "price_range": (2, 5), "category": "Électricité", "quantity_range": (10, 300)},
    {"name": "Interrupteur simple", "price_range": (3, 8), "category": "Électricité", "quantity_range": (1, 50)},
]


def get_cities() -> List[Dict]:
    """Récupère la liste des villes depuis l'API"""
    try:
        response = requests.get(f"{API_BASE}/cities", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        return []
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des villes: {e}")
        return []


def get_products() -> List[Dict]:
    """Récupère la liste des produits depuis l'API"""
    try:
        response = requests.get(f"{API_BASE}/products", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        return []
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des produits: {e}")
        return []


def get_customers() -> List[Dict]:
    """Récupère la liste des clients depuis l'API"""
    try:
        response = requests.get(f"{API_BASE}/customers", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        return []
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des clients: {e}")
        return []


def get_payment_methods() -> List[Dict]:
    """Récupère la liste des méthodes de paiement depuis l'API"""
    try:
        response = requests.get(f"{API_BASE}/payment-methods", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', []) if isinstance(data, dict) else data
        return []
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des méthodes de paiement: {e}")
        return []


def create_customer(cities: List[Dict]) -> Optional[Dict]:
    """Crée un nouveau client"""
    customer_type = random.choice(['particulier', 'entreprise', 'entrepreneur', 'gouvernement'])
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    city = random.choice(cities) if cities else None
    
    phone = f"+243{random.randint(900000000, 999999999)}"
    email = f"{first_name.lower()}.{last_name.lower()}@gmail.com" if customer_type == 'particulier' else \
            f"contact@{random.choice(COMPANY_NAMES).lower().replace(' ', '')}.cd"
    
    customer_data = {
        "firstName": first_name,
        "lastName": last_name,
        "phone": phone,
        "email": email if random.random() < 0.7 else None,
        "customerType": customer_type,
        "companyName": random.choice(COMPANY_NAMES) if customer_type != 'particulier' else None,
        "address": f"Avenue {random.randint(1, 100)}, {city['name'] if city else 'Kinshasa'}",
        "cityId": city['id'] if city else None,
        "taxId": f"T{random.randint(1000000, 9999999)}" if customer_type != 'particulier' else None,
        "isActive": True,
    }
    
    try:
        response = requests.post(f"{API_BASE}/customers", json=customer_data, timeout=5)
        if response.status_code == 201:
            data = response.json()
            return data.get('data') if isinstance(data, dict) else data
        return None
    except Exception as e:
        logger.error(f"Erreur lors de la création du client: {e}")
        return None


def generate_order(customers: List[Dict], cities: List[Dict], products: List[Dict], 
                   payment_methods: List[Dict]) -> Optional[Dict]:
    """Génère une commande complète avec client, items et paiement"""
    
    # Sélectionner ou créer un client
    customer = None
    if customers and random.random() < 0.7:  # 70% utiliser un client existant
        customer = random.choice(customers)
    else:
        customer = create_customer(cities)
        if not customer:
            return None
    
    # Sélectionner une ville de livraison
    delivery_city = random.choice(cities) if cities else None
    if not delivery_city:
        return None
    
    # Générer les items de commande (1 à 5 produits)
    num_items = random.randint(1, 5)
    order_items = []
    subtotal = 0
    
    for _ in range(num_items):
        # Utiliser un produit de l'API ou un produit par défaut
        if products:
            product = random.choice(products)
            product_name = product.get('name', '')
        else:
            product_template = random.choice(PRODUCTS)
            product_name = product_template['name']
            product = {'id': None, 'name': product_name}
        
        # Trouver le prix dans le template
        product_template = next((p for p in PRODUCTS if p['name'] == product_name), None)
        if product_template:
            min_price, max_price = product_template['price_range']
            min_qty, max_qty = product_template['quantity_range']
            unit_price = round(random.uniform(min_price, max_price), 2)
            quantity = random.randint(min_qty, max_qty)
        else:
            unit_price = round(random.uniform(10, 100), 2)
            quantity = random.randint(1, 50)
        
        total_price = round(unit_price * quantity, 2)
        subtotal += total_price
        
        if product.get('id'):
            order_items.append({
                "productId": product['id'],
                "quantity": quantity,
                "unitPrice": unit_price,
                "totalPrice": total_price,
            })
    
    if not order_items:
        return None
    
    # Calculer les montants
    tax = round(subtotal * 0.16, 2)  # 16% TVA
    shipping_cost = 0 if subtotal > 1000 else round(random.uniform(20, 50), 2)
    total_amount = round(subtotal + tax + shipping_cost, 2)
    
    # Générer le statut
    status = random.choice(ORDER_STATUSES)
    
    # Générer les dates
    order_date = datetime.now() - timedelta(days=random.randint(0, 365))
    delivery_date = None
    completed_date = None
    
    if status in ['expédiée', 'livrée']:
        delivery_date = order_date + timedelta(days=random.randint(1, 7))
    if status == 'livrée':
        completed_date = order_date + timedelta(days=random.randint(3, 10))
    
    # Créer la commande
    order_data = {
        "customerId": customer['id'],
        "deliveryCityId": delivery_city['id'],
        "deliveryAddress": f"Avenue {random.randint(1, 100)}, {delivery_city['name']}",
        "status": status,
        "subtotal": subtotal,
        "tax": tax,
        "shippingCost": shipping_cost,
        "totalAmount": total_amount,
        "orderDate": order_date.isoformat(),
        "deliveryDate": delivery_date.isoformat() if delivery_date else None,
        "completedDate": completed_date.isoformat() if completed_date else None,
        "notes": "Livraison urgente" if random.random() < 0.3 else None,
        "items": order_items,
    }
    
    try:
        response = requests.post(f"{API_BASE}/orders", json=order_data, timeout=10)
        if response.status_code == 201:
            order = response.json()
            order_data = order.get('data') if isinstance(order, dict) else order
            
            # Créer le paiement
            if payment_methods and order_data:
                payment_method = random.choice(payment_methods)
                payment_status = 'échoué' if status == 'annulée' else \
                                'complété' if status in ['livrée', 'expédiée'] else \
                                random.choice(PAYMENT_STATUSES)
                
                payment_data = {
                    "orderId": order_data['id'],
                    "paymentMethodId": payment_method['id'],
                    "amount": total_amount,
                    "status": payment_status,
                    "paymentDate": order_date.isoformat() if payment_status == 'complété' else None,
                    "reference": f"{payment_method['name'][:3].upper()}{random.randint(100000, 999999)}" 
                                if payment_method.get('requiresOnline') else None,
                }
                
                try:
                    payment_response = requests.post(f"{API_BASE}/payments", json=payment_data, timeout=5)
                    if payment_response.status_code == 201:
                        logger.info(f"✅ Commande créée: {order_data.get('orderNumber', 'N/A')} | "
                                  f"Client: {customer.get('firstName', '')} {customer.get('lastName', '')} | "
                                  f"Montant: ${total_amount:.2f} | "
                                  f"Statut: {status} | "
                                  f"Paiement: {payment_status}")
                    else:
                        logger.warning(f"⚠️ Commande créée mais paiement échoué: {payment_response.status_code}")
                except Exception as e:
                    logger.error(f"Erreur lors de la création du paiement: {e}")
            
            return order_data
        else:
            logger.error(f"❌ Erreur API commande: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création de la commande: {e}")
        return None


def run_simulator():
    """Lance le simulateur en continu"""
    logger.info("🚀 Démarrage du simulateur de commandes BI")
    logger.info(f"📡 API: {API_BASE}")
    logger.info("⏸️  Appuyez sur Ctrl+C pour arrêter\n")
    
    # Charger les données initiales
    logger.info("📥 Chargement des données...")
    cities = get_cities()
    products = get_products()
    customers = get_customers()
    payment_methods = get_payment_methods()
    
    logger.info(f"🏙️  {len(cities)} villes disponibles")
    logger.info(f"📦 {len(products)} produits disponibles")
    logger.info(f"👥 {len(customers)} clients disponibles")
    logger.info(f"💳 {len(payment_methods)} méthodes de paiement disponibles\n")
    
    if not cities or not products:
        logger.error("❌ Impossible de charger les villes ou produits. Vérifiez que l'API est accessible.")
        return
    
    order_count = 0
    success_count = 0
    
    try:
        while True:
            # Générer une commande
            order = generate_order(customers, cities, products, payment_methods)
            
            if order:
                success_count += 1
                # Mettre à jour la liste des clients si un nouveau a été créé
                if len(customers) < 50:  # Limiter la taille de la liste
                    new_customers = get_customers()
                    if new_customers:
                        customers = new_customers
            
            order_count += 1
            
            # Attendre entre 5 et 30 secondes avant la prochaine commande
            wait_time = random.uniform(5, 30)
            time.sleep(wait_time)
            
            # Afficher des statistiques toutes les 10 commandes
            if order_count % 10 == 0:
                success_rate = (success_count / order_count) * 100
                logger.info(
                    f"\n📊 Statistiques: {order_count} commandes tentées, "
                    f"{success_count} réussies ({success_rate:.1f}%)\n"
                )
                
    except KeyboardInterrupt:
        logger.info("\n\n⏹️  Arrêt du simulateur")
        logger.info(f"📊 Total: {order_count} commandes tentées, {success_count} réussies")
        if order_count > 0:
            success_rate = (success_count / order_count) * 100
            logger.info(f"✅ Taux de succès: {success_rate:.1f}%")


if __name__ == "__main__":
    # Vérifier que l'API est accessible
    try:
        response = requests.get(f"{API_BASE}/sales/stats", timeout=3)
        logger.info("✅ Connexion à l'API réussie\n")
    except requests.exceptions.RequestException:
        logger.warning(
            f"⚠️  Impossible de se connecter à l'API ({API_BASE})\n"
            "Assurez-vous que le serveur NestJS est démarré.\n"
        )
    
    run_simulator()

