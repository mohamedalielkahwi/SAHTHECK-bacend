import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum TypeEpauleDto {
  DOULOUREUSE_SIMPLE = 'douloureuse_simple',
  HYPERALGIQUE = 'hyperalgique',
  PSEUDO_PARALYTIQUE = 'pseudo_paralytique',
  BLOQUEE = 'bloquee',
}

export class CreateDiagnosticDto {
  @ApiProperty({
    description: 'Type of shoulder condition',
    enum: TypeEpauleDto,
    example: 'douloureuse_simple',
    required: false,
  })
  @IsOptional()
  @IsEnum(TypeEpauleDto)
  typeEpaule?: TypeEpauleDto;

  @ApiProperty({
    description: 'Main diagnostic description',
    example: 'Rotator cuff tendinitis',
  })
  @IsString()
  diagnostic: string;

  @ApiProperty({
    description: 'Differential diagnoses',
    example: 'Impingement syndrome, acromioclavicular joint arthritis',
    required: false,
  })
  @IsOptional()
  @IsString()
  diagnosticDiff?: string;

  @ApiProperty({
    description: 'Severity level (light/moderate/severe)',
    example: 'moderate',
    required: false,
  })
  @IsOptional()
  @IsString()
  severite?: string;

  @ApiProperty({
    description: 'General observations and notes',
    example: 'Patient has good prognosis with proper rehabilitation',
    required: false,
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
