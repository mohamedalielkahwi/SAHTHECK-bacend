import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'The new email of the user',
    example: 'test@test.tes',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The new phone number of the user',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9 ]{8}$/, { message: 'phone number must be exactly 8 digits' })
  phone: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main Street, City, Country',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The new age of the Patient',
    example: 30,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  age?: string;

  @ApiProperty({
    description: 'The biography of the Doctor',
    example:
      'Dr. John Doe is a highly experienced cardiologist with over 20 years of practice.',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio?: string;
}
