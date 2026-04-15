import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer"; // 1. Import Type

export class CreateDailySlotsDto {

    @Type(() => Date) // 2. This converts the incoming string to a Date object
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({ 
      description: 'Date for which the slots are being created', 
      example: '2026-12-12T00:00:00.000Z' // ISO format is best practice
    })
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Start hour (0-23)', example: 8 })
    startTime: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'End hour (0-23)', example: 17 })
    endTime: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Place of the appointment', example: 'Clinic A' })
    @IsString()
    place: string;
}