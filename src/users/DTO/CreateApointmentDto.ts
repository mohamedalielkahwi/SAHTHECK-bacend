import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the specialist',
    example: 'specialist-123',
  })
  specialistId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the availability',
    example: 'availability-123',
  })
  availabilityId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Reason for the appointment',
    example: 'Regular check-up',
  })
  reason!: string;
}
