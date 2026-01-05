import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsIn,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsIn(['particulier', 'entreprise', 'entrepreneur', 'gouvernement'])
  customerType: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsUUID()
  @IsOptional()
  cityId?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

