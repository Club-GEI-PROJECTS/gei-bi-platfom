import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSaleDto: CreateSaleDto) {
    console.log(`📨 POST /api/sales - Reçu:`, JSON.stringify(createSaleDto, null, 2));
    const sale = await this.salesService.create(createSaleDto);
    return {
      success: true,
      message: 'Vente enregistrée avec succès',
      data: sale,
    };
  }

  @Get()
  async findAll() {
    console.log(`📨 GET /api/sales - Récupération de toutes les ventes`);
    const sales = await this.salesService.findAll();
    console.log(`✅ ${sales.length} ventes récupérées\n`);
    return {
      success: true,
      count: sales.length,
      data: sales,
    };
  }

  @Get('stats')
  async getStats() {
    console.log(`📨 GET /api/sales/stats - Récupération des statistiques`);
    const stats = await this.salesService.getStats();
    console.log(`✅ Stats récupérées: ${stats.totalSales} ventes, ${stats.totalRevenue} de CA\n`);
    return {
      success: true,
      data: stats,
    };
  }
}

