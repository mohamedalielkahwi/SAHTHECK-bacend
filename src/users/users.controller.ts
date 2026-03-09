import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
import { RefreshTokenDto } from './DTO/RefreshTokenDto';

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
  
  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser( req.params.id , req.user.userId);
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
    return this.usersService.getProfile(req.user.userId);
  }

  @ApiResponse({
    status: 200,
    description: 'The access token has been successfully refreshed.',
    type: SignInResponse,
  })
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.usersService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch("/validate-doctor/:id")
  async validateDoctor(@Request() req) {
    return this.usersService.validateDoctor(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch("/validate-admin/:id")
  async validateAdmin(@Request() req) {
    return this.usersService.validateAdmin(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get("/whoami")
  async whoAmI(@Request() req) {
    return { userId: req.user.userId, email: req.user.email, role: req.user.role };
  }
}
