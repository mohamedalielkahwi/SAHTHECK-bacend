import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class CreateProtocoleReeducationDto {
  // Objectives
  @ApiProperty({
    description: 'Short-term objectives',
    example: 'Reduce pain to EVA 3, restore passive ROM to 150° antepulsion',
    required: false,
  })
  @IsOptional()
  @IsString()
  objectifsCourt?: string;

  @ApiProperty({
    description: 'Long-term objectives',
    example: 'Return to sports, full ROM, strength 5/5',
    required: false,
  })
  @IsOptional()
  @IsString()
  objectifsLong?: string;

  // Means - Physical therapy modalities
  @ApiProperty({
    description: 'Use analgesic physiotherapy (infrared, ultrasound, etc)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  physiotherapieAntalgique?: boolean;

  @ApiProperty({
    description: 'Types of physical therapy modalities',
    example: 'infrared, TENS, cryotherapy, ultrasound',
    required: false,
  })
  @IsOptional()
  @IsString()
  typesPhysio?: string;

  @ApiProperty({
    description: 'Whether massage therapy is included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  massage?: boolean;

  @ApiProperty({
    description: 'Details about massage',
    example: 'Soft tissue mobilization, trigger point release',
    required: false,
  })
  @IsOptional()
  @IsString()
  massageDetail?: string;

  @ApiProperty({
    description: 'Whether hydrotherapy is included',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  balnéotherapie?: boolean;

  // Exercise program
  @ApiProperty({
    description: 'Whether passive mobilizations are included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mobilisationsPassives?: boolean;

  @ApiProperty({
    description: 'Whether active mobilizations are included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  mobilisationsActives?: boolean;

  @ApiProperty({
    description: 'Whether strengthening exercises are included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  renforcement?: boolean;

  @ApiProperty({
    description: 'Whether proprioception training is included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  proprioception?: boolean;

  @ApiProperty({
    description: 'Detailed description of exercise program',
    example:
      'Pendulum exercises week 1-2, passive stretching week 3-4, active ROM week 5+',
    required: false,
  })
  @IsOptional()
  @IsString()
  exercicesDetail?: string;

  @ApiProperty({
    description: 'IDs of exercise catalog items assigned to patient',
    example: ['exc1', 'exc2', 'exc3'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  exerciceIds?: string[];

  // Frequency
  @ApiProperty({
    description: 'Number of sessions per week',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  seancesParSemaine?: number;

  @ApiProperty({
    description: 'Duration of protocol in weeks',
    example: 8,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(52)
  dureeSemaines?: number;

  // Orthosis/Bracing
  @ApiProperty({
    description: 'Whether orthosis/brace is prescribed',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  orthese?: boolean;

  @ApiProperty({
    description: 'Type of orthosis',
    example: 'Shoulder immobilizer sling',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeOrthese?: string;

  @ApiProperty({
    description: 'General observations about protocol',
    example: 'Emphasize compliance with home exercises',
    required: false,
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
