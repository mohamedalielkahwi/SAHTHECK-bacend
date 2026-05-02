import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePatientSessionDto {
  @ApiProperty({
    description: 'General notes about the session',
    example: 'Patient improving, good mobility',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Session date and time',
    example: '2026-04-30T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  sessionDate?: string;
}
