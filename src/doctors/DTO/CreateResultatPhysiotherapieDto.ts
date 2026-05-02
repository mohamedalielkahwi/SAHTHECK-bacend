import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum EvolutionDto {
  AMELIORATION = 'amelioration',
  STABLE = 'stable',
  AGGRAVATION = 'aggravation',
}

export class CreateResultatPhysiotherapieDto {
  // Final scores
  @ApiProperty({
    description: 'Final Constant score as JSON string',
    example:
      '{"douleur":15,"activites":20,"mobilite":50,"force":15,"total":100}',
    required: false,
  })
  @IsOptional()
  @IsString()
  constantScoreFinal?: string;

  @ApiProperty({
    description: 'Final Quick DASH score as JSON string',
    example: '{"items":[...], "score":23.5}',
    required: false,
  })
  @IsOptional()
  @IsString()
  quickDashScoreFinal?: string;

  @ApiProperty({
    description: 'Final pain intensity EVA (0-10)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  evaFinal?: number;

  // Evolution indicators
  @ApiProperty({
    description: 'Pain evolution (improved/stable/worsened)',
    enum: EvolutionDto,
    example: 'amelioration',
    required: false,
  })
  @IsOptional()
  @IsEnum(EvolutionDto)
  evolutionDouleur?: EvolutionDto;

  @ApiProperty({
    description: 'Mobility evolution',
    enum: EvolutionDto,
    example: 'amelioration',
    required: false,
  })
  @IsOptional()
  @IsEnum(EvolutionDto)
  evolutionMobilite?: EvolutionDto;

  @ApiProperty({
    description: 'Strength evolution',
    enum: EvolutionDto,
    example: 'amelioration',
    required: false,
  })
  @IsOptional()
  @IsEnum(EvolutionDto)
  evolutionForce?: EvolutionDto;

  @ApiProperty({
    description: 'Functional evolution',
    enum: EvolutionDto,
    example: 'amelioration',
    required: false,
  })
  @IsOptional()
  @IsEnum(EvolutionDto)
  evolutionFonction?: EvolutionDto;

  // Final amplitudes (degrees)
  @ApiProperty({
    description: 'Final antepulsion range',
    example: 155,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  antepulsionFinal?: number;

  @ApiProperty({
    description: 'Final abduction range',
    example: 145,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  abductionFinal?: number;

  @ApiProperty({
    description: 'Final external rotation range',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationExterneFinal?: number;

  @ApiProperty({
    description: 'Final internal rotation range',
    example: 80,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationInterneFinal?: number;

  @ApiProperty({
    description: 'Whether treatment objectives were achieved',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  objectifsAtteints?: boolean;

  @ApiProperty({
    description: 'Physiotherapist conclusion',
    example:
      'Patient showed good progress with full ROM recovery and return to activities',
    required: false,
  })
  @IsOptional()
  @IsString()
  conclusionKine?: string;

  @ApiProperty({
    description: 'Follow-up recommendations (stop/continue/refer)',
    example: 'Stop rehabilitation, patient discharged to home program',
    required: false,
  })
  @IsOptional()
  @IsString()
  suitesDonnees?: string;
}
