import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { Gender, Role } from 'generated/prisma/enums';
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.tes',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9 ]{8}$/, { message: 'phone number must be exactly 8 digits' })
  phone:string;
  
  @ApiProperty({
    description: 'The gender of the user',
    example: 'MALE',
  })
  @IsString()
  @IsEnum(Gender, { message: 'gender must be either MALE,FEMALE or OTHER' })
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
  })
  @IsString()
  @IsEnum(Role, { message: 'role must be either ADMIN,PATIENT or DOCTOR' })
  @IsNotEmpty()
  role: Role;
  
  @ApiProperty({
    description: 'The age of the Patient',
    example: 30,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  age?: string;
}
