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

export class CreateBilanKinesitherapiqueDto {
  // Interview
  @ApiProperty({
    description: 'Primary chief complaint',
    example: 'Shoulder pain with limited mobility',
    required: false,
  })
  @IsOptional()
  @IsString()
  plainte?: string;

  @ApiProperty({
    description: 'History of condition',
    example: 'Gradual onset over 3 months after tennis injury',
    required: false,
  })
  @IsOptional()
  @IsString()
  historique?: string;

  @ApiProperty({
    description: 'Current pain intensity EVA (0-10)',
    example: 6.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  intensiteEVA?: number;

  // Scores (as JSON strings for flexibility)
  @ApiProperty({
    description: 'Constant score as JSON string',
    example:
      '{"douleur":15,"activites":20,"mobilite":40,"force":15,"total":90}',
    required: false,
  })
  @IsOptional()
  @IsString()
  constantScore?: string;

  @ApiProperty({
    description: 'Quick DASH score as JSON string',
    example: '{"items":[1,2,1,2,1],"score":45.5}',
    required: false,
  })
  @IsOptional()
  @IsString()
  quickDashScore?: string;

  @ApiProperty({
    description: 'DASH Arabic score as JSON string',
    example: '{"items":[...],"score":50}',
    required: false,
  })
  @IsOptional()
  @IsString()
  dashArabeScore?: string;

  // Active joint range of motion (degrees)
  @ApiProperty({
    description: 'Active antepulsion range',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  antepulsionActive?: number;

  @ApiProperty({
    description: 'Active abduction range',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  abductionActive?: number;

  @ApiProperty({
    description: 'Active retraction range',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(90)
  retractionActive?: number;

  @ApiProperty({
    description: 'Active external rotation range',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationExterneActive?: number;

  @ApiProperty({
    description: 'Active internal rotation range',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationInterneActive?: number;

  // Passive joint range of motion (degrees)
  @ApiProperty({
    description: 'Passive antepulsion range',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  antepulsionPassive?: number;

  @ApiProperty({
    description: 'Passive abduction range',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  abductionPassive?: number;

  @ApiProperty({
    description: 'Passive retraction range',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(90)
  retractionPassive?: number;

  @ApiProperty({
    description: 'Passive external rotation range',
    example: 80,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationExternePassive?: number;

  @ApiProperty({
    description: 'Passive internal rotation range',
    example: 85,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  rotationInternePassive?: number;

  // Muscle testing (0-5 scale)
  @ApiProperty({
    description: 'Deltoid muscle strength (0-5)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  deltoideTesting?: number;

  @ApiProperty({
    description: 'Supraspinatus muscle strength (0-5)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  susEpineuxTesting?: number;

  @ApiProperty({
    description: 'Infraspinatus muscle strength (0-5)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  infraEpineuxTesting?: number;

  @ApiProperty({
    description: 'Subscapularis muscle strength (0-5)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  subScapulaireTesting?: number;

  // Specific physiotherapy tests
  @ApiProperty({
    description: 'Jobe test result',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  testJobe?: boolean;

  @ApiProperty({
    description: 'Patte test result',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  testPatte?: boolean;

  @ApiProperty({
    description: 'Gerber test result',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  testGerber?: boolean;

  @ApiProperty({
    description: 'Neer test result',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  testNeer?: boolean;

  @ApiProperty({
    description: 'Hawkins test result',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  testHawkins?: boolean;

  // Functional assessment
  @ApiProperty({
    description: 'Hand to mouth test',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mainBouche?: boolean;

  @ApiProperty({
    description: 'Hand to head test',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mainTete?: boolean;

  @ApiProperty({
    description: 'Hand to neck test',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mainNuque?: boolean;

  @ApiProperty({
    description: 'Hand to back test',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mainDos?: boolean;

  @ApiProperty({
    description: 'General observations',
    example: 'Good motivation, pain-limited movement',
    required: false,
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
