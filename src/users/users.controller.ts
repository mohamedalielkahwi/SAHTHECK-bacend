import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/CreateUserDto';
import { UsersService } from './users.service';
import { SignInDto } from './DTO/SignInDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiHeaders, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed in.',
    type: SignInDto,
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }
  
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    example: {
      email: 'test@test.com',
      id: 1,
    },
  })
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
