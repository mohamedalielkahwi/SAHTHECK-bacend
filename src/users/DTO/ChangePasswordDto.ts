import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        description: 'The current password of the user',
        example: 'currentPassword123',
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: 'The new password of the user',
        example: 'newPassword123',
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}