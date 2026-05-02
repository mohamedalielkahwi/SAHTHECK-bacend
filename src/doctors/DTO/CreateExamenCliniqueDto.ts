import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamenCliniqueDto {
  // Interrogatoire
  @ApiProperty({
    description: 'Patient age',
    example: 45,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiProperty({
    description: 'Patient sex',
    example: 'M',
    required: false,
  })
  @IsOptional()
  @IsString()
  sexe?: string;

  @ApiProperty({
    description: 'Patient profession',
    example: 'Engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiProperty({
    description: 'Dominant limb (G/D)',
    example: 'D',
    required: false,
  })
  @IsOptional()
  @IsString()
  membreDominant?: string;

  @ApiProperty({
    description: 'Sport activity',
    example: 'Tennis, Swimming',
    required: false,
  })
  @IsOptional()
  @IsString()
  activiteSportive?: string;

  @ApiProperty({
    description: 'Social coverage',
    example: 'CNSS',
    required: false,
  })
  @IsOptional()
  @IsString()
  couvertureSociale?: string;

  // Antécédents
  @ApiProperty({
    description: 'Medical history (JSON string)',
    example: '{"allergies":"Penicillin","surgeries":"none"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  antecedents?: string;

  // Douleur
  @ApiProperty({
    description: 'Pain location',
    example: 'Right shoulder',
    required: false,
  })
  @IsOptional()
  @IsString()
  siegeDouleur?: string;

  @ApiProperty({
    description: 'Pain radiation',
    example: 'Down to elbow',
    required: false,
  })
  @IsOptional()
  @IsString()
  irradiation?: string;

  @ApiProperty({
    description: 'Pain intensity EVA scale (0-10)',
    example: 7.5,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  intensiteEVA?: number;

  @ApiProperty({
    description: 'Pain type rhythm (mechanical/inflammatory/mixed)',
    example: 'mechanical',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeRythme?: string;

  @ApiProperty({
    description: 'Aggravating factors',
    example: 'Lifting, sleeping on side',
    required: false,
  })
  @IsOptional()
  @IsString()
  facteurAggravant?: string;

  @ApiProperty({
    description: 'Relieving factors',
    example: 'Rest, ice',
    required: false,
  })
  @IsOptional()
  @IsString()
  facteurSoulagement?: string;

  @ApiProperty({
    description: 'Pain onset (progressive/sudden)',
    example: 'progressive',
    required: false,
  })
  @IsOptional()
  @IsString()
  debutDouleur?: string;

  // Retentissement
  @ApiProperty({
    description: 'Affects activities of daily living',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  retentissementAVQ?: boolean;

  @ApiProperty({
    description: 'Affects professional activities',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  retentissementPro?: boolean;

  @ApiProperty({
    description: 'Affects sleep',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  retentissementSommeil?: boolean;

  // Examen physique
  @ApiProperty({
    description: 'Inspection findings',
    example: 'Slight atrophy of supraspinatus',
    required: false,
  })
  @IsOptional()
  @IsString()
  inspection?: string;

  @ApiProperty({
    description: 'Active mobility as JSON string (degrees)',
    example: '{"antepulsion":120,"abduction":90,"retraction":45}',
    required: false,
  })
  @IsOptional()
  @IsString()
  mobiliteActive?: string;

  @ApiProperty({
    description: 'Passive mobility as JSON string (degrees)',
    example: '{"antepulsion":150,"abduction":120,"retraction":60}',
    required: false,
  })
  @IsOptional()
  @IsString()
  mobilitePassive?: string;

  @ApiProperty({
    description: 'Conflict tests as JSON string (boolean results)',
    example: '{"neer":true,"hawkins":true,"yocum":false}',
    required: false,
  })
  @IsOptional()
  @IsString()
  testConflits?: string;

  @ApiProperty({
    description: 'Tendon tests as JSON string (boolean results)',
    example: '{"jobe":false,"patte":true,"gerber":false}',
    required: false,
  })
  @IsOptional()
  @IsString()
  testsTendineux?: string;

  @ApiProperty({
    description: 'Palpation findings',
    example: 'Tender over supraspinatus tendon',
    required: false,
  })
  @IsOptional()
  @IsString()
  palpation?: string;

  @ApiProperty({
    description: 'Cervical examination findings',
    example: 'No restriction',
    required: false,
  })
  @IsOptional()
  @IsString()
  examenCervical?: string;

  @ApiProperty({
    description: 'Neurological examination findings',
    example: 'Reflexes intact, no paresthesia',
    required: false,
  })
  @IsOptional()
  @IsString()
  examenNeurologique?: string;

  // Bilan fonctionnel simple
  @ApiProperty({
    description: 'Hand to mouth test',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mainBouche?: boolean;

  @ApiProperty({
    description: 'Hand to head test',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mainTete?: boolean;

  @ApiProperty({
    description: 'Hand to neck test',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mainNuque?: boolean;

  @ApiProperty({
    description: 'Hand to back test',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mainDos?: boolean;
}
