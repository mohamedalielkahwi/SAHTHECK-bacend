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
import { UpdateUserDto } from './DTO/UpdateUserDto';
import { UpdateUserResponse } from './response/UpadteUserResponse';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { GoogleSignupResponse } from './response/GoogleSignupResponse';

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

  @Post('/signin/verify')
  @ApiResponse({
    status: 200,
    description: 'OTP verified, tokens returned.',
    type: SignInResponse,
  })
  async verifySignIn(@Body() body: { userId: string; code: string }) {
    return this.usersService.verifySignIn(body.userId, body.code);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser(req.params.id, req.user.userId);
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
  @Patch('/validate-doctor/:id')
  async validateDoctor(@Request() req) {
    return this.usersService.validateDoctor(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('/validate-admin/:id')
  async validateAdmin(@Request() req) {
    return this.usersService.validateAdmin(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/whoami')
  async whoAmI(@Request() req) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UpdateUserResponse,
  })
  @Patch('/update-user')
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(
      req.user.userId,
      req.user.role,
      updateUserDto,
    );
  }
  @Get('/auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('/auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated with Google.',
    type: GoogleSignupResponse,
  })
  async googleAuthCallback(@Request() req) {
    return this.usersService.googlesignup(req.user);
  }
}
