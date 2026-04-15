import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ModifyApointmentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Status for modifying the appointment', example: 'ACCEPTED' })
    status: string;

    @IsString()
    @ApiProperty({ description: 'ID of the appointment to modify', example: 'appointment-123' })
    appointmentId: string;
}