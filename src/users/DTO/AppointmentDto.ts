import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AppointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID of the specialist for the appointment' })
  specialistId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Date of the appointment' })
  date: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Time of the appointment' })
  time: Date;
  reason: string;

  @IsString()
  @ApiProperty({ description: 'ID of the clinic for the appointment' })
  clinicId?: string;
}
