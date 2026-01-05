import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { City } from '../entities/city.entity';
import { Product } from '../entities/product.entity';
import { Province } from '../entities/province.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    console.log(`📥 Création d'une vente: ${createSaleDto.product} x${createSaleDto.quantity} à ${createSaleDto.city}`);
    
    // Trouver la ville (elle devrait exister après le seed)
    let city = await this.cityRepository.findOne({
      where: { name: createSaleDto.city },
      relations: ['province'],
    });

    console.log(`🏙️  Ville recherchée: ${createSaleDto.city} - ${city ? '✅ Trouvée' : '❌ Non trouvée'}`);

    // Si la ville n'existe pas, créer une ville par défaut dans Kinshasa
    if (!city) {
      console.log(`⚠️  Ville non trouvée, création dans Kinshasa...`);
      let province = await this.provinceRepository.findOne({
        where: { name: 'Kinshasa' },
      });

      if (!province) {
        console.log(`📦 Création de la province Kinshasa...`);
        province = this.provinceRepository.create({
          name: 'Kinshasa',
          code: 'KIN',
        });
        province = await this.provinceRepository.save(province);
        console.log(`✅ Province Kinshasa créée: ${province.id}`);
      }

      city = this.cityRepository.create({
        name: createSaleDto.city,
        type: 'commune',
        provinceId: province.id,
      });
      city = await this.cityRepository.save(city);
      console.log(`✅ Ville créée: ${city.name} (${city.id})`);
    }

    // Trouver ou créer le produit
    let product = await this.productRepository.findOne({
      where: { name: createSaleDto.product },
    });

    console.log(`📦 Produit recherché: ${createSaleDto.product} - ${product ? '✅ Trouvé' : '❌ Non trouvé'}`);

    if (!product) {
      const category = this.extractCategory(createSaleDto.product);
      console.log(`📦 Création du produit: ${createSaleDto.product} (catégorie: ${category})`);
      product = this.productRepository.create({
        name: createSaleDto.product,
        category: category,
      });
      product = await this.productRepository.save(product);
      console.log(`✅ Produit créé: ${product.name} (${product.id})`);
    }

    // Calculer le prix total
    const totalPrice = createSaleDto.quantity * createSaleDto.unitPrice;
    console.log(`💰 Prix unitaire: ${createSaleDto.unitPrice}, Quantité: ${createSaleDto.quantity}, Total: ${totalPrice}`);

    // Créer la vente
    const sale = this.salesRepository.create({
      cityId: city.id,
      productId: product.id,
      pointOfSale: createSaleDto.pointOfSale,
      quantity: createSaleDto.quantity,
      unitPrice: createSaleDto.unitPrice,
      totalPrice: totalPrice,
      saleDate: new Date(),
    });

    const savedSale = await this.salesRepository.save(sale);
    console.log(`✅ Vente enregistrée: ${savedSale.id} - Total: ${totalPrice}\n`);
    return savedSale;
  }

  async findAll(): Promise<Sale[]> {
    return await this.salesRepository.find({
      relations: ['city', 'product'],
      order: { saleDate: 'DESC' },
    });
  }

  async getStats() {
    const totalSales = await this.salesRepository.count();
    const totalRevenue = await this.salesRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.totalPrice)', 'total')
      .getRawOne();

    return {
      totalSales,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
    };
  }

  private extractCategory(productName: string): string {
    const name = productName.toLowerCase();
    if (name.includes('ciment')) return 'Ciment';
    if (name.includes('fer') || name.includes('béton')) return 'Acier';
    if (name.includes('sable')) return 'Granulat';
    if (name.includes('gravier')) return 'Granulat';
    if (name.includes('peinture')) return 'Finition';
    return 'Autre';
  }
}

