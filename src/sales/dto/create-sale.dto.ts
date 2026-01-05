import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  pointOfSale: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  unitPrice: number;
}

