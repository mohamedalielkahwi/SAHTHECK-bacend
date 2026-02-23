import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './DTO/CreateUserDto';
import { UsersService } from './users.service';
import { SignInDto } from './DTO/SignInDto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Post("/signup")
    async createUser(@Body() createUserDto:CreateUserDto){
        return this.usersService.createUser(createUserDto);
    }
    @Post("/signin")
    async signIn(@Body() signInDto:SignInDto){
        return this.usersService.signIn(signInDto);
    }
}
