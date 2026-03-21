import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifySignInDto {
    @ApiProperty({
        description: 'The ID of the user to verify',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'The verification code',
        example: '123456',
    })
    @IsString()
    code: string;
}