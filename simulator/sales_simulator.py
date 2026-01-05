"""
Simulateur de ventes pour la plateforme BI du Club GEI
Simule des ventes continues depuis toutes les communes de Kinshasa et villes de la RDC
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
API_URL = "http://localhost:3000/api/sales"
API_BASE = "http://localhost:3000/api"

# Toutes les communes de Kinshasa (24 communes)
KINSHASA_COMMUNES = [
    "Bandalungwa", "Barumbu", "Bumbu", "Gombe", "Kalamu", "Kasa-Vubu",
    "Kimbanseke", "Kinshasa", "Kintambo", "Kisenso", "Lemba", "Limete",
    "Lingwala", "Makala", "Maluku", "Masina", "Matete", "Mont-Ngafula",
    "Ndjili", "Ngaba", "Ngaliema", "Ngiri-Ngiri", "Nsele", "Selembao"
]

# Principales villes de la RDC (hors Kinshasa)
RDC_CITIES = [
    # Kongo-Central
    "Matadi", "Boma", "Muanda", "Kisantu", "Mbanza-Ngungu", "Lukula",
    # Kwilu
    "Bandundu", "Kikwit", "Bulungu", "Gungu", "Idiofa", "Masi-Manimba",
    # Kasaï-Central
    "Kananga", "Lubao", "Luiza", "Mwene-Ditu",
    # Kasaï-Oriental
    "Mbuji-Mayi", "Tshilenge",
    # Sud-Kivu
    "Bukavu", "Uvira", "Baraka", "Fizi", "Shabunda", "Mwenga",
    # Nord-Kivu
    "Goma", "Beni", "Butembo", "Rutshuru", "Masisi", "Walikale",
    # Haut-Katanga
    "Lubumbashi", "Likasi", "Kipushi", "Kakanda", "Kasumbalesa",
    # Lualaba
    "Kolwezi", "Musoshi", "Kambove",
    # Tshopo
    "Kisangani", "Ubundu", "Yahuma", "Bafwasende",
    # Ituri
    "Bunia", "Aru", "Mahagi", "Mambasa",
    # Équateur
    "Mbandaka", "Gemena", "Lisala", "Bikoro",
    # Autres
    "Kindu", "Isiro", "Buta", "Boende", "Kalemie", "Kamina"
]

# Toutes les villes (communes + villes)
ALL_CITIES = KINSHASA_COMMUNES + RDC_CITIES

# Points de vente réalistes par type de localisation
POINTS_OF_SALE_TEMPLATES = {
    "kinshasa": [
        "Dépôt Central {name}",
        "Magasin {name}",
        "Succursale {name}",
        "Point de vente {name}",
        "Dépôt {name}",
        "Entrepôt {name}",
    ],
    "other": [
        "Dépôt {name}",
        "Magasin {name}",
        "Succursale {name}",
        "Point de vente {name}",
        "Entrepôt régional {name}",
    ]
}

# Catalogue complet de produits avec prix réalistes (en USD)
PRODUCTS: List[Dict[str, any]] = [
    # CIMENT
    {"name": "Ciment Portland 50kg", "price_range": (12, 18), "category": "Ciment", "quantity_range": (1, 100)},
    {"name": "Ciment Portland 25kg", "price_range": (6, 10), "category": "Ciment", "quantity_range": (1, 150)},
    {"name": "Ciment gris 50kg", "price_range": (11, 17), "category": "Ciment", "quantity_range": (1, 100)},
    {"name": "Ciment blanc 50kg", "price_range": (15, 22), "category": "Ciment", "quantity_range": (1, 50)},
    
    # ACIER / FER À BÉTON
    {"name": "Fer à béton 6mm", "price_range": (8, 12), "category": "Acier", "quantity_range": (10, 200)},
    {"name": "Fer à béton 8mm", "price_range": (10, 15), "category": "Acier", "quantity_range": (10, 200)},
    {"name": "Fer à béton 10mm", "price_range": (15, 22), "category": "Acier", "quantity_range": (5, 150)},
    {"name": "Fer à béton 12mm", "price_range": (18, 25), "category": "Acier", "quantity_range": (5, 120)},
    {"name": "Fer à béton 14mm", "price_range": (22, 30), "category": "Acier", "quantity_range": (5, 100)},
    {"name": "Fer à béton 16mm", "price_range": (25, 35), "category": "Acier", "quantity_range": (5, 80)},
    {"name": "Fer à béton 20mm", "price_range": (35, 50), "category": "Acier", "quantity_range": (3, 50)},
    {"name": "Treillis soudé 6mm", "price_range": (8, 12), "category": "Acier", "quantity_range": (5, 50)},
    {"name": "Fil de fer noir", "price_range": (3, 6), "category": "Acier", "quantity_range": (1, 20)},
    
    # GRANULATS
    {"name": "Sable fin (m³)", "price_range": (25, 40), "category": "Granulat", "quantity_range": (1, 20)},
    {"name": "Sable de rivière (m³)", "price_range": (20, 35), "category": "Granulat", "quantity_range": (1, 25)},
    {"name": "Gravier 5/15 (m³)", "price_range": (30, 45), "category": "Granulat", "quantity_range": (1, 20)},
    {"name": "Gravier 15/25 (m³)", "price_range": (35, 50), "category": "Granulat", "quantity_range": (1, 15)},
    {"name": "Gravier 25/40 (m³)", "price_range": (40, 55), "category": "Granulat", "quantity_range": (1, 15)},
    {"name": "Pierre concassée (m³)", "price_range": (35, 50), "category": "Granulat", "quantity_range": (1, 15)},
    {"name": "Laterite (m³)", "price_range": (15, 25), "category": "Granulat", "quantity_range": (1, 30)},
    
    # BRIQUES ET PARPAINGS
    {"name": "Brique rouge standard", "price_range": (0.3, 0.8), "category": "Maçonnerie", "quantity_range": (50, 2000)},
    {"name": "Brique rouge pleine", "price_range": (0.4, 1.0), "category": "Maçonnerie", "quantity_range": (50, 1500)},
    {"name": "Parpaing creux 20x20x40", "price_range": (0.8, 1.5), "category": "Maçonnerie", "quantity_range": (20, 1000)},
    {"name": "Parpaing creux 15x20x40", "price_range": (0.7, 1.3), "category": "Maçonnerie", "quantity_range": (20, 1000)},
    {"name": "Parpaing plein 20x20x40", "price_range": (1.0, 1.8), "category": "Maçonnerie", "quantity_range": (20, 800)},
    {"name": "Agglo creux 20x20x40", "price_range": (0.9, 1.6), "category": "Maçonnerie", "quantity_range": (20, 1000)},
    
    # COUVERTURE
    {"name": "Tôle ondulée galvanisée", "price_range": (8, 15), "category": "Couverture", "quantity_range": (5, 200)},
    {"name": "Tôle ondulée prélaquée", "price_range": (10, 18), "category": "Couverture", "quantity_range": (5, 150)},
    {"name": "Tôle trapézoïdale", "price_range": (12, 20), "category": "Couverture", "quantity_range": (5, 150)},
    {"name": "Tuile métallique", "price_range": (15, 25), "category": "Couverture", "quantity_range": (5, 100)},
    {"name": "Bardeau bitumineux", "price_range": (20, 35), "category": "Couverture", "quantity_range": (5, 80)},
    
    # FINITION
    {"name": "Peinture blanche 20L", "price_range": (35, 55), "category": "Finition", "quantity_range": (1, 30)},
    {"name": "Peinture blanche 10L", "price_range": (18, 30), "category": "Finition", "quantity_range": (1, 50)},
    {"name": "Peinture blanche 5L", "price_range": (10, 18), "category": "Finition", "quantity_range": (1, 80)},
    {"name": "Peinture couleur 20L", "price_range": (40, 65), "category": "Finition", "quantity_range": (1, 25)},
    {"name": "Peinture couleur 10L", "price_range": (22, 35), "category": "Finition", "quantity_range": (1, 40)},
    {"name": "Peinture anti-rouille", "price_range": (25, 40), "category": "Finition", "quantity_range": (1, 20)},
    {"name": "Enduit extérieur 25kg", "price_range": (12, 20), "category": "Finition", "quantity_range": (1, 50)},
    {"name": "Enduit intérieur 25kg", "price_range": (10, 18), "category": "Finition", "quantity_range": (1, 60)},
    {"name": "Carreau céramique 30x30", "price_range": (8, 15), "category": "Finition", "quantity_range": (5, 200)},
    {"name": "Carreau céramique 40x40", "price_range": (12, 22), "category": "Finition", "quantity_range": (5, 150)},
    {"name": "Carreau céramique 60x60", "price_range": (18, 30), "category": "Finition", "quantity_range": (5, 100)},
    {"name": "Carrelage grès cérame", "price_range": (20, 35), "category": "Finition", "quantity_range": (5, 80)},
    
    # MENUISERIE
    {"name": "Porte métallique standard", "price_range": (150, 280), "category": "Menuiserie", "quantity_range": (1, 10)},
    {"name": "Porte métallique blindée", "price_range": (300, 500), "category": "Menuiserie", "quantity_range": (1, 5)},
    {"name": "Porte en bois massif", "price_range": (200, 400), "category": "Menuiserie", "quantity_range": (1, 8)},
    {"name": "Fenêtre PVC simple vitrage", "price_range": (80, 150), "category": "Menuiserie", "quantity_range": (1, 15)},
    {"name": "Fenêtre PVC double vitrage", "price_range": (150, 280), "category": "Menuiserie", "quantity_range": (1, 10)},
    {"name": "Fenêtre aluminium", "price_range": (120, 220), "category": "Menuiserie", "quantity_range": (1, 12)},
    {"name": "Battant de fenêtre", "price_range": (40, 80), "category": "Menuiserie", "quantity_range": (1, 20)},
    
    # PLOMBERIE
    {"name": "Tuyau PVC 20mm", "price_range": (2, 4), "category": "Plomberie", "quantity_range": (5, 100)},
    {"name": "Tuyau PVC 25mm", "price_range": (2.5, 5), "category": "Plomberie", "quantity_range": (5, 100)},
    {"name": "Tuyau PVC 32mm", "price_range": (3, 6), "category": "Plomberie", "quantity_range": (5, 80)},
    {"name": "Tuyau PVC 40mm", "price_range": (4, 8), "category": "Plomberie", "quantity_range": (5, 60)},
    {"name": "Tuyau PVC 50mm", "price_range": (5, 10), "category": "Plomberie", "quantity_range": (5, 50)},
    {"name": "Raccord PVC 20mm", "price_range": (0.5, 1.5), "category": "Plomberie", "quantity_range": (10, 200)},
    {"name": "Raccord PVC 25mm", "price_range": (0.8, 2), "category": "Plomberie", "quantity_range": (10, 150)},
    {"name": "Robinet mélangeur", "price_range": (25, 50), "category": "Plomberie", "quantity_range": (1, 20)},
    {"name": "Robinet simple", "price_range": (8, 18), "category": "Plomberie", "quantity_range": (1, 30)},
    
    # ÉLECTRICITÉ
    {"name": "Câble électrique 1.5mm²", "price_range": (1, 2.5), "category": "Électricité", "quantity_range": (10, 500)},
    {"name": "Câble électrique 2.5mm²", "price_range": (1.5, 3.5), "category": "Électricité", "quantity_range": (10, 400)},
    {"name": "Câble électrique 4mm²", "price_range": (2, 5), "category": "Électricité", "quantity_range": (10, 300)},
    {"name": "Câble électrique 6mm²", "price_range": (3, 7), "category": "Électricité", "quantity_range": (10, 200)},
    {"name": "Interrupteur simple", "price_range": (3, 8), "category": "Électricité", "quantity_range": (1, 50)},
    {"name": "Interrupteur double", "price_range": (5, 12), "category": "Électricité", "quantity_range": (1, 40)},
    {"name": "Prise électrique", "price_range": (4, 10), "category": "Électricité", "quantity_range": (1, 50)},
    {"name": "Ampoule LED 12W", "price_range": (5, 12), "category": "Électricité", "quantity_range": (1, 100)},
    {"name": "Ampoule LED 20W", "price_range": (8, 18), "category": "Électricité", "quantity_range": (1, 80)},
    
    # AUTRES
    {"name": "Clou de construction", "price_range": (2, 5), "category": "Quincaillerie", "quantity_range": (1, 50)},
    {"name": "Vis à bois", "price_range": (3, 8), "category": "Quincaillerie", "quantity_range": (1, 100)},
    {"name": "Vis à métal", "price_range": (4, 10), "category": "Quincaillerie", "quantity_range": (1, 80)},
    {"name": "Cheville plastique", "price_range": (0.1, 0.5), "category": "Quincaillerie", "quantity_range": (10, 500)},
    {"name": "Colle à carrelage 25kg", "price_range": (15, 28), "category": "Colles", "quantity_range": (1, 30)},
    {"name": "Mastic silicone", "price_range": (3, 8), "category": "Colles", "quantity_range": (1, 50)},
]


def get_point_of_sale(city: str) -> str:
    """Génère un nom de point de vente réaliste selon la ville"""
    is_kinshasa = city in KINSHASA_COMMUNES
    templates = POINTS_OF_SALE_TEMPLATES["kinshasa" if is_kinshasa else "other"]
    template = random.choice(templates)
    
    # Générer un numéro ou un nom de quartier
    if random.random() < 0.5:
        name = f"{random.randint(1, 5)}"
    else:
        quartiers = ["Centre", "Nord", "Sud", "Est", "Ouest", "Central", "Principal"]
        name = random.choice(quartiers)
    
    return template.format(name=name)


# Cache des prix unitaires par produit (générés une seule fois)
PRODUCT_PRICES: Dict[str, float] = {}

def initialize_product_prices():
    """Initialise les prix unitaires fixes pour chaque produit"""
    global PRODUCT_PRICES
    if not PRODUCT_PRICES:
        for product in PRODUCTS:
            min_price, max_price = product["price_range"]
            # Générer un prix fixe dans la plage pour ce produit
            PRODUCT_PRICES[product["name"]] = round(random.uniform(min_price, max_price), 2)
        logger.info(f"💰 {len(PRODUCT_PRICES)} prix unitaires initialisés")


def get_product_price(product_name: str) -> float:
    """Récupère le prix unitaire fixe d'un produit"""
    if product_name not in PRODUCT_PRICES:
        # Si le produit n'est pas dans la liste, générer un prix par défaut
        product = next((p for p in PRODUCTS if p["name"] == product_name), None)
        if product:
            min_price, max_price = product["price_range"]
            PRODUCT_PRICES[product_name] = round(random.uniform(min_price, max_price), 2)
        else:
            # Prix par défaut pour produits inconnus
            PRODUCT_PRICES[product_name] = round(random.uniform(10, 50), 2)
    return PRODUCT_PRICES[product_name]


def generate_sale() -> Dict:
    """Génère une vente aléatoire"""
    # Sélectionner une ville (Kinshasa a plus de poids car plus de communes)
    if random.random() < 0.4:  # 40% de chance pour Kinshasa
        city = random.choice(KINSHASA_COMMUNES)
    else:
        city = random.choice(RDC_CITIES)
    
    # Sélectionner un produit
    product = random.choice(PRODUCTS)
    min_qty, max_qty = product["quantity_range"]
    
    # Utiliser le prix fixe du produit
    unit_price = get_product_price(product["name"])
    quantity = random.randint(min_qty, max_qty)
    
    return {
        "city": city,
        "pointOfSale": get_point_of_sale(city),
        "product": product["name"],
        "quantity": quantity,
        "unitPrice": unit_price
    }


def send_sale(sale_data: Dict) -> bool:
    """Envoie une vente à l'API (format simple pour compatibilité)"""
    try:
        response = requests.post(
            API_URL,
            json=sale_data,
            timeout=5,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            total = sale_data['quantity'] * sale_data['unitPrice']
            logger.info(
                f"✅ {sale_data['city']:20} | {sale_data['product'][:30]:30} | "
                f"x{sale_data['quantity']:4} | ${total:8.2f}"
            )
            return True
        else:
            logger.error(f"❌ Erreur API: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Erreur de connexion: {e}")
        return False


def create_order_with_sale(sale_data: Dict) -> bool:
    """Crée une commande complète avec client, items et paiement (si les endpoints existent)"""
    try:
        # Vérifier si les endpoints existent
        try:
            test_response = requests.get(f"{API_BASE}/customers", timeout=2)
            has_orders_api = test_response.status_code == 200
        except:
            has_orders_api = False
        
        if not has_orders_api:
            # Fallback: créer une vente simple
            return send_sale(sale_data)
        
        # Récupérer les données nécessaires
        cities_resp = requests.get(f"{API_BASE}/cities", timeout=3)
        products_resp = requests.get(f"{API_BASE}/products", timeout=3)
        customers_resp = requests.get(f"{API_BASE}/customers", timeout=3)
        payment_methods_resp = requests.get(f"{API_BASE}/payment-methods", timeout=3)
        
        cities = cities_resp.json().get('data', []) if cities_resp.status_code == 200 else []
        products = products_resp.json().get('data', []) if products_resp.status_code == 200 else []
        customers = customers_resp.json().get('data', []) if customers_resp.status_code == 200 else []
        payment_methods = payment_methods_resp.json().get('data', []) if payment_methods_resp.status_code == 200 else []
        
        # Trouver la ville et le produit
        city = next((c for c in cities if c.get('name') == sale_data['city']), None)
        product = next((p for p in products if p.get('name') == sale_data['product']), None)
        
        if not city or not product:
            # Fallback: créer une vente simple
            return send_sale(sale_data)
        
        # Sélectionner ou créer un client
        customer = None
        if customers and random.random() < 0.7:
            customer = random.choice(customers)
        else:
            # Créer un nouveau client
            first_name = random.choice(['Jean', 'Pierre', 'Marie', 'Catherine', 'Koffi', 'Moussa', 'Fatou', 'Aissatou'])
            last_name = random.choice(['Kabila', 'Tshisekedi', 'Lumumba', 'Diallo', 'Ba', 'Traoré'])
            customer_type = random.choice(['particulier', 'entreprise', 'entrepreneur'])
            
            customer_data = {
                "firstName": first_name,
                "lastName": last_name,
                "phone": f"+243{random.randint(900000000, 999999999)}",
                "email": f"{first_name.lower()}.{last_name.lower()}@gmail.com" if customer_type == 'particulier' else None,
                "customerType": customer_type,
                "companyName": random.choice(['BTP Congo', 'Construction Pro', 'Matériaux Express']) if customer_type != 'particulier' else None,
                "address": f"Avenue {random.randint(1, 100)}, {city['name']}",
                "cityId": city['id'],
                "isActive": True,
            }
            
            customer_resp = requests.post(f"{API_BASE}/customers", json=customer_data, timeout=5)
            if customer_resp.status_code == 201:
                customer = customer_resp.json().get('data')
        
        if not customer:
            # Fallback: créer une vente simple
            return send_sale(sale_data)
        
        # Créer la commande avec un seul item
        quantity = sale_data['quantity']
        # Utiliser le prix fixe du produit
        unit_price = get_product_price(sale_data['product'])
        total_price = quantity * unit_price
        subtotal = total_price
        tax = round(subtotal * 0.16, 2)
        shipping_cost = 0 if subtotal > 1000 else round(random.uniform(20, 50), 2)
        total_amount = round(subtotal + tax + shipping_cost, 2)
        
        status = random.choice(['confirmée', 'en_traitement', 'expédiée', 'livrée'])
        
        order_data = {
            "customerId": customer['id'],
            "deliveryCityId": city['id'],
            "deliveryAddress": f"Avenue {random.randint(1, 100)}, {city['name']}",
            "status": status,
            "subtotal": subtotal,
            "tax": tax,
            "shippingCost": shipping_cost,
            "totalAmount": total_amount,
            "orderDate": datetime.now().isoformat(),
            "items": [{
                "productId": product['id'],
                "quantity": quantity,
                "unitPrice": unit_price,
                "totalPrice": total_price,
            }],
        }
        
        order_resp = requests.post(f"{API_BASE}/orders", json=order_data, timeout=10)
        if order_resp.status_code == 201:
            order = order_resp.json().get('data')
            
            # Créer le paiement
            if payment_methods and order:
                payment_method = random.choice(payment_methods)
                payment_status = 'complété' if status in ['livrée', 'expédiée'] else 'en_attente'
                
                payment_data = {
                    "orderId": order['id'],
                    "paymentMethodId": payment_method['id'],
                    "amount": total_amount,
                    "status": payment_status,
                    "paymentDate": datetime.now().isoformat() if payment_status == 'complété' else None,
                    "reference": f"{payment_method['name'][:3].upper()}{random.randint(100000, 999999)}" 
                                if payment_method.get('requiresOnline') else None,
                }
                
                payment_resp = requests.post(f"{API_BASE}/payments", json=payment_data, timeout=5)
                if payment_resp.status_code == 201:
                    logger.info(
                        f"✅ Commande: {order.get('orderNumber', 'N/A'):15} | "
                        f"{sale_data['city']:20} | {sale_data['product'][:25]:25} | "
                        f"x{quantity:4} | ${total_amount:8.2f} | {status}"
                    )
                    return True
        
        # Si la commande a échoué, fallback sur vente simple
        return send_sale(sale_data)
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création de commande: {e}")
        # Fallback: créer une vente simple
        return send_sale(sale_data)


def run_simulator():
    """Lance le simulateur en continu"""
    logger.info("🚀 Démarrage du simulateur de ventes BI")
    logger.info(f"📡 API: {API_URL}")
    logger.info(f"🏙️  {len(ALL_CITIES)} villes/communes disponibles")
    logger.info(f"📦 {len(PRODUCTS)} produits dans le catalogue")
    
    # Initialiser les prix unitaires fixes
    initialize_product_prices()
    
    logger.info("⏸️  Appuyez sur Ctrl+C pour arrêter\n")
    logger.info(f"{'Ville':20} | {'Produit':30} | {'Qté':4} | {'Total':8}")
    logger.info("-" * 70)
    
    sale_count = 0
    success_count = 0
    
    try:
        while True:
            # Générer une vente
            sale_data = generate_sale()
            
            # Essayer de créer une commande complète, sinon créer une vente simple
            if create_order_with_sale(sale_data):
                success_count += 1
            
            sale_count += 1
            
            # Attendre entre 2 et 15 secondes avant la prochaine vente
            wait_time = random.uniform(2, 15)
            time.sleep(wait_time)
            
            # Afficher des statistiques toutes les 20 ventes
            if sale_count % 20 == 0:
                success_rate = (success_count / sale_count) * 100
                logger.info(
                    f"\n📊 Statistiques: {sale_count} ventes tentées, "
                    f"{success_count} réussies ({success_rate:.1f}%)\n"
                )
                
    except KeyboardInterrupt:
        logger.info("\n\n⏹️  Arrêt du simulateur")
        logger.info(f"📊 Total: {sale_count} ventes tentées, {success_count} réussies")
        if sale_count > 0:
            success_rate = (success_count / sale_count) * 100
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
