import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateConduiteATenirDto {
  // Traitement médicamenteux
  @ApiProperty({
    description: 'Analgesic prescription (e.g., Paracetamol 1g x3/day)',
    example: 'Paracetamol 1g x3/day',
    required: false,
  })
  @IsOptional()
  @IsString()
  antalgiques?: string;

  @ApiProperty({
    description: 'Anti-inflammatory prescription',
    example: 'Ibuprofen 400mg x2/day for 10 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  antiInflammatoires?: string;

  @ApiProperty({
    description: 'Muscle relaxant prescription',
    example: 'Thiocolchicoside 4mg x3/day',
    required: false,
  })
  @IsOptional()
  @IsString()
  myorelaxants?: string;

  @ApiProperty({
    description: 'Corticoid prescription',
    example: 'Prednisolone 20mg/day for 5 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  corticoides?: string;

  @ApiProperty({
    description: 'Other medications',
    example: 'Topical diclofenac gel',
    required: false,
  })
  @IsOptional()
  @IsString()
  autresMedicaments?: string;

  // Traitement local
  @ApiProperty({
    description: 'Whether infiltration is prescribed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  infiltration?: boolean;

  @ApiProperty({
    description: 'Details about infiltration',
    example: 'Subacromial infiltration with corticoid + local anesthetic',
    required: false,
  })
  @IsOptional()
  @IsString()
  infiltrationDetail?: string;

  @ApiProperty({
    description: 'Whether shock wave therapy is prescribed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ondesDeChoc?: boolean;

  @ApiProperty({
    description: 'Whether joint distension is prescribed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  arthroDistension?: boolean;

  // Chirurgie
  @ApiProperty({
    description: 'Whether surgery is indicated',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  chirurgie?: boolean;

  @ApiProperty({
    description: 'Type of surgery if indicated',
    example: 'Arthroscopic rotator cuff repair',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeChirurgie?: string;

  // Repos / recommandations
  @ApiProperty({
    description: 'Whether relative rest is recommended',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  reposRelatif?: boolean;

  @ApiProperty({
    description: 'General recommendations',
    example: 'Avoid overhead activities, use sling for 2 weeks',
    required: false,
  })
  @IsOptional()
  @IsString()
  recommandations?: string;

  // Suivi
  @ApiProperty({
    description: 'Next follow-up appointment date',
    example: '2026-05-15T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  prochainRDV?: string;

  @ApiProperty({
    description: 'Treatment objectives',
    example: 'Reduce pain to EVA 3, restore 120° active abduction',
    required: false,
  })
  @IsOptional()
  @IsString()
  objectifs?: string;
}
