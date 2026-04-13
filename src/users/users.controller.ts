import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './DTO/CreateUserDto';
import { VerifySignInDto } from './DTO/VerifySignInDto';
import { UsersService } from './users.service';
import { SignInDto } from './DTO/SignInDto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { ProfileResponse } from './response/ProfileResponse';
import { SignInResponse } from './response/SignInResponse';
import { RefreshTokenDto } from './DTO/RefreshTokenDto';
import { UpdateUserDto } from './DTO/UpdateUserDto';
import { UpdateUserResponse } from './response/UpadteUserResponse';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { GoogleSignupResponse } from './response/GoogleSignupResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhoAmiIResponse } from './response/WhoAmiIResponse';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';

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
  @ApiBearerAuth()
  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          // 👈 replace the regex with this
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadImage(req.user.userId, file);
  }

  @Post('/signin/verify')
  @ApiResponse({
    status: 200,
    description: 'OTP verified, tokens returned.',
    type: SignInResponse,
  })
  async verifySignIn(@Body() body: VerifySignInDto) {
    return this.usersService.verifySignIn(body.userId, body.code);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('/delete-account')
  @ApiResponse({
    status: 200,
    description: 'The account has been successfully deleted.',
  })
  async deleteOwnAccount(@Request() req) {
    return this.usersService.deleteOwnAccount(req.user.userId);
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
  @ApiResponse({
    status: 200,
    description: 'The doctor has been successfully validated.',
  })
  async validateDoctor(@Request() req) {
    return this.usersService.validateDoctor(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully validated.',
  })
  @Patch('/validate-admin/:id')
  async validateAdmin(@Request() req) {
    return this.usersService.validateAdmin(req.params.id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'the userId and email and role of the authenticated user.',
    type: WhoAmiIResponse,
  })
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

  @Post('/auth/google/mobile')
  @ApiResponse({
    status: 200,
    type: GoogleSignupResponse,
  })
  async googleMobileAuth(@Body() body: { idToken: string }) {
    return this.usersService.googleMobileAuth(body.idToken);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The password has been successfully changed.',
  })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }
}
