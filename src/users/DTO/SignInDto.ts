import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto{

    @ApiProperty({
        description: 'The email of the user',
        example: 'test@test.tes',
      })
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123',
      })
    @IsNotEmpty()
    password:string;
}