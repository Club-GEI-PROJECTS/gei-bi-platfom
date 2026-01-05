import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  deliveryCityId: string;

  @IsString()
  deliveryAddress: string;

  @IsString()
  @IsIn(['en_attente', 'confirmée', 'en_traitement', 'expédiée', 'livrée', 'annulée'])
  status: string;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingCost?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

