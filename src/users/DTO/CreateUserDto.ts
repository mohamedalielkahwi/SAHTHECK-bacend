import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender, Role } from 'generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.tes',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9 ]{8}$/, { message: 'phone number must be exactly 8 digits' })
  phone!: string;

  @ApiProperty({ description: 'The gender of the user', example: 'MALE' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender, { message: 'gender must be either MALE, FEMALE or OTHER' })
  gender!: Gender;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main Street, City, Country',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ description: 'The role of the user', example: 'PATIENT' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be either ADMIN, PATIENT or DOCTOR' })
  role!: Role;

  // ─── PATIENT fields ───────────────────────────────────────────

  @ApiProperty({
    description: 'Age of the patient. Required for PATIENT role',
    example: 30,
  })
  @IsOptional()
  @IsNumberString()
  age?: string;

  @ApiProperty({
    description: 'Weight of the patient in kg. Required for PATIENT role',
    example: 70.5,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({
    description: 'Height of the patient in cm. Required for PATIENT role',
    example: 175.1,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  // ─── DOCTOR fields ────────────────────────────────────────────

  @ApiProperty({
    description: 'Specialization of the doctor. Required for DOCTOR role',
    example: 'Cardiology',
  })
  @IsOptional()
  @IsString()
  speciality?: string;

  @ApiProperty({
    description: 'Biography of the doctor. Required for DOCTOR role',
    example: 'Dr. John Doe is a highly experienced cardiologist.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'License number of the doctor. Required for DOCTOR role',
    example: '1234/95',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4,5}\/\d{2}$/, {
    message: 'licenseNumber must be in format XXXX/YY or XXXXX/YY',
  })
  licenseNumber?: string;

  @ApiProperty({
    description: 'Clinic name of the doctor',
    example: 'Clinique des Oliviers',
  })
  @IsOptional()
  @IsString()
  clinic?: string;

  @ApiProperty({
    description: 'Location of the doctor clinic',
    example: 'Tunis, Tunisia',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Latitude of the doctor clinic',
    example: 36.8065,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the doctor clinic',
    example: 10.1815,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
