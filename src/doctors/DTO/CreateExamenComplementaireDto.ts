import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum ExamenComplementaireTypeDto {
  RADIOGRAPHIE = 'radiographie',
  ECHOGRAPHIE = 'echographie',
  IRM = 'IRM',
  ARTHROSCANNER = 'arthroscanner',
  BILAN_BIOLOGIQUE = 'bilanBiologique',
  AUTRE = 'autre',
}

export class CreateExamenComplementaireDto {
  @ApiProperty({
    description: 'Type of complementary examination',
    enum: ExamenComplementaireTypeDto,
    example: 'echographie',
  })
  @IsEnum(ExamenComplementaireTypeDto)
  type: ExamenComplementaireTypeDto;

  @ApiProperty({
    description: 'Description of the examination',
    example: 'Shoulder ultrasound to assess rotator cuff',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Results or observations from examination',
    example: 'Small supraspinatus tear seen on imaging',
    required: false,
  })
  @IsOptional()
  @IsString()
  resultat?: string;

  @ApiProperty({
    description: 'Date of the examination',
    example: '2026-04-30T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
