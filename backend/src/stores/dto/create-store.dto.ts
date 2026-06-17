import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsOptional()
  @IsString()
  owner_id?: string;
}
