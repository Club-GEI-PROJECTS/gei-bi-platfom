import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  paymentMethodId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsIn(['en_attente', 'complété', 'échoué', 'remboursé'])
  status: string;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

