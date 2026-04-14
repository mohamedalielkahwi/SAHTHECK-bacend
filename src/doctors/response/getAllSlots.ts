import { ApiProperty } from '@nestjs/swagger';

export class GetAllSlotsResponse {
  @ApiProperty({
    description: 'Unique identifier for the availability slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  availabilityId: string;

  @ApiProperty({
    description: 'ID of the specialist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  specialistId: string;
  
  @ApiProperty({
    description: 'Date of the availability slot',
    example: '2026-12-12T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Start time of the availability slot',
    example: '2026-12-12T09:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the availability slot',
    example: '2026-12-12T17:00:00.000Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Indicates if the availability slot is booked',
    example: false,
  })
  isBooked: boolean;
}
