import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender, Role } from 'generated/prisma/enums';
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.tes',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9 ]{8}$/, { message: 'phone number must be exactly 8 digits' })
  phone: string;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'MALE',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender, { message: 'gender must be either MALE,FEMALE or OTHER' })
  gender: Gender;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be either ADMIN,PATIENT or DOCTOR' })
  role: Role;

  @ApiProperty({
    description: 'The age of the Patient',
    example: 30,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  age?: string;

  @ApiProperty({
    description: 'The specialization of the Doctor',
    example: 'Cardiologist',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  speciality?: string;

  @ApiProperty({
    description: 'The biography of the Doctor',
    example: 'Dr. John Doe is a highly experienced cardiologist with over 20 years of practice.',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'The license number of the Doctor',
    example: '1234/56 or 12345/67',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,5}\/\d{2}$/, {
    message: 'licenseNumber must be in format XXXX/YY or XXXXX/YY',
  })
  licenseNumber: string;

  @ApiProperty({
    description: 'The status of the admin to moderate the Doctors',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  canModerate?: boolean;
}
