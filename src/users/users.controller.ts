import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/CreateUserDto';
import { UsersService } from './users.service';
import { SignInDto } from './DTO/SignInDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProfileResponse } from './response/ProfileResponse';
import { SignInResponse } from './response/SignInResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed in.',
    type: SignInResponse,
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }
  
  @Delete('/delete/:id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async deleteUser(@Request() req) {
    const userId = req.params.id;
    return this.usersService.deleteUser(userId);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully retrieved.',
    type: ProfileResponse,
  })
  @Get('/profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'The access token has been successfully refreshed.',
    type: SignInResponse,
  })
  @Post('/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.usersService.refreshToken(body.refreshToken);
  }
}
