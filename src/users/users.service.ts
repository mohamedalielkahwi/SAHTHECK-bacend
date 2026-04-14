import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse } from './response/SignInResponse';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { UpdateUserDto } from './DTO/UpdateUserDto';
import { CreateUserDto } from './DTO/CreateUserDto';
import { OtpService } from 'src/otp/otp.service';
import { MinioService } from 'src/minio/minio.service';
import { OAuth2Client } from 'google-auth-library';
import { Readable } from 'node:stream';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';

interface GoogleProfile {
  email: string;
  fullName: string;
  picture: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly otpService: OtpService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      address,
      role,
      age,
      height,
      weight,
      speciality,
      bio,
      licenseNumber,
      clinic,
      location,
      latitude,
      longitude,
    } = createUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        phone,
      },
    });
    if (user) throw new ConflictException('User already exists');
    if (role === 'DOCTOR' && (!speciality || !bio || !licenseNumber)) {
      throw new ConflictException(
        'Speciality, bio and license number are required for doctors',
      );
    }
    if (role === 'PATIENT' && !age) {
      throw new ConflictException('Age is required for patients');
    }
    const hashedPassword = await this.hashPassword(password);
    return this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        address,
        gender,
        role,
        patient:
          role === 'PATIENT'
            ? {
                create: {
                  age: age ? Number.parseInt(age) : undefined,
                  weight,
                  height,
                },
              }
            : undefined,
        specialist:
          role === 'DOCTOR'
            ? {
                create: {
                  speciality,
                  bio,
                  licenseNumber,
                  clinic,
                  location,
                  latitude,
                  longitude,
                },
              }
            : undefined,
        admin:
          role === 'ADMIN'
            ? {
                create: {
                  canModerate: false,
                },
              }
            : undefined,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        address: true,
        role: true,
        patient: {
          select: {
            age: true,
            height: true,
            weight: true,
          },
        },
        specialist: {
          select: {
            speciality: true,
            bio: true,
            licenseNumber: true,
            isValidated: true,
            clinic: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
        admin: {
          select: {
            canModerate: true,
          },
        },
      },
    });
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async uploadImage(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new ConflictException('User not found');
    if (user.imageUrl) {
      await this.minioService.deleteFile(user.imageUrl);
    }

    // upload new image
    const imageUrl = await this.minioService.uploadFile(file, 'profile-images');

    // save URL to database
    await this.prisma.user.update({
      where: { userId },
      data: { imageUrl },
    });

    return { imageUrl };
  }
  async signIn(
    signInDto,
  ): Promise<{ require2FA: boolean; userId: string; email: string }> {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ConflictException('Invalid credentials');

    if (!user.password) {
      throw new ConflictException('Please sign in with Google');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ConflictException('Invalid credentials');
    console.log('User authenticated, sending OTP for 2FA');
    this.otpService
      .sendOtp(user.userId, user.email, 'TWO_FACTOR')
      .catch((err) => {
        console.error('Failed to send OTP:', err);
      });
    return { require2FA: true, userId: user.userId, email: user.email };
  }

  async verifySignIn(userId: string, code: string): Promise<SignInResponse> {
    await this.otpService.verifyOtp(userId, code, 'TWO_FACTOR');

    const user = await this.prisma.user.findUnique({ where: { userId } });

    const payload = {
      email: user!.email,
      userId: user!.userId,
      role: user!.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
      userId: user!.userId,
      email: user!.email,
      role: user!.role,
      imageUrl: user!.imageUrl ? user!.imageUrl : undefined,
    };
  }

  async deleteUser(userId: string, id: string) {
    const userRole = await this.prisma.user.findUnique({
      where: {
        userId: id,
        admin: {
          canModerate: true,
        },
      },
      select: {
        role: true,
      },
    });
    if (!userRole)
      throw new ConflictException('Only approved admins can delete users');
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) throw new ConflictException('User not found');
    await this.prisma.user.delete({
      where: {
        userId,
      },
    });
    return { message: 'User deleted successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        gender: true,
        imageUrl: true,
        role: true,
        patient: {
          select: {
            age: true,
            height: true,
            weight: true,
          },
        },
        specialist: {
          select: {
            speciality: true,
            bio: true,
            licenseNumber: true,
            isValidated: true,
            clinic: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
        admin: {
          select: {
            canModerate: true,
          },
        },
      },
    });
    if (!user) throw new ConflictException('User not found');
    return user;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        this.refreshTokenConfig,
      );
      const newAcessToken = await this.jwtService.signAsync({
        email: payload.email,
        userId: payload.userId,
        role: payload.role,
      });
      return { accessToken: newAcessToken };
    } catch (error) {
      throw new ConflictException('Invalid refresh token');
    }
  }
  async validateDoctor(userId: string, id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        userId: id,
        canModerate: true,
      },
    });
    if (!admin)
      throw new ConflictException('Only approved admins can validate doctors');
    const doctor = await this.prisma.specialist.findUnique({
      where: {
        userId,
        isValidated: false,
      },
    });
    if (!doctor)
      throw new ConflictException('Doctor not found or is validated');
    await this.prisma.specialist.update({
      where: {
        userId,
      },
      data: {
        isValidated: true,
      },
    });
    return { message: 'The doctor has been successfully validated.' };
  }
  async validateAdmin(userId: string, id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        userId: id,
        canModerate: true,
      },
    });
    if (!admin)
      throw new ConflictException('Only approved admins can validate admins');
    const adminUser = await this.prisma.admin.findUnique({
      where: {
        userId,
        canModerate: false,
      },
    });
    if (!adminUser)
      throw new ConflictException('Admin not found or is validated');
    await this.prisma.admin.update({
      where: {
        userId,
      },
      data: {
        canModerate: true,
      },
    });
    return { message: 'The admin has been successfully validated.' };
  }
  async updateUser(userId: string, role: string, updateUserDto: UpdateUserDto) {
    const {
      fullName,
      email,
      phone,
      address,
      age,
      height,
      weight,
      bio,
      clinic,
      location,
      latitude,
      longitude,
    } = updateUserDto;
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          userId,
        },
        data: {
          fullName,
          email,
          phone,
          address,
          specialist:
            role === 'DOCTOR'
              ? {
                  update: {
                    bio,
                    clinic,
                    location,
                    latitude,
                    longitude,
                  },
                }
              : undefined,
          patient:
            role === 'PATIENT'
              ? {
                  upsert: {
                    create: {
                      age: age ? Number.parseInt(age) : 0,
                      height: height ?? 0,
                      weight: weight ?? 0,
                    },
                    update: {
                      age: age ? Number.parseInt(age) : undefined,
                      height,
                      weight,
                    },
                  },
                }
              : undefined,
        },
        select: {
          userId: true,
          fullName: true,
          email: true,
          phone: true,
          address: true,
          role: true,
          imageUrl: true,
          patient: {
            select: {
              age: true,
              height: true,
              weight: true,
            },
          },
          specialist: {
            select: {
              speciality: true,
              bio: true,
              licenseNumber: true,
              isValidated: true,
              clinic: true,
              location: true,
              latitude: true,
              longitude: true,
            },
          },
          admin: {
            select: {
              canModerate: true,
            },
          },
        },
      });
      const payload = {
        email: updateUser.email,
        userId: updateUser.userId.toString(),
        role: updateUser.role,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, this.refreshTokenConfig),
      ]);
      return {
        ...updateUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new ConflictException('User not found');
    }
  }
  async googlesignup(googleUser: GoogleProfile) {
    const { email, fullName, picture } = googleUser;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      const payload = {
        email: user.email,
        userId: user.userId.toString(),
        role: user.role,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, this.refreshTokenConfig),
      ]);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        isNew: false,
        userId: user.userId,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      };
    } else {
      let imageUrl: string | null = null;
      if (picture) {
        try {
          // download the image buffer from Google
          const response = await fetch(picture);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // create a fake Multer file object
          const file: Express.Multer.File = {
            buffer,
            originalname: `${Date.now()}-google-avatar.jpg`,
            mimetype: 'image/jpeg',
            size: buffer.length,
            fieldname: 'file',
            encoding: '7bit',
            stream: Readable.from(buffer), // 👈 fix null error
            destination: '',
            filename: '',
            path: '',
          };

          imageUrl = await this.minioService.uploadFile(file, 'profile-images');
        } catch (error) {
          console.error('Failed to upload Google profile picture:', error);
          // if upload fails just continue without image
        }
      }

      const newUser = await this.prisma.user.create({
        data: {
          email,
          fullName,
          role: 'PATIENT',
          imageUrl, // 👈 save MinIO URL
        },
      });

      const payload = {
        email: newUser.email,
        userId: newUser.userId.toString(),
        role: newUser.role,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, this.refreshTokenConfig),
      ]);

      return {
        accessToken,
        refreshToken,
        isNew: true,
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
        imageUrl: newUser.imageUrl,
      };
    }
  }
  async googleMobileAuth(idToken: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // verify the token Google sent
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new ConflictException('Invalid Google token');

    const googleUser = {
      email: payload.email!,
      fullName: payload.name ?? '',
      picture: payload.picture ?? '',
    };

    // reuse your existing googlesignup logic
    return this.googlesignup(googleUser);
  }

  async deleteOwnAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new ConflictException('User not found');

    // delete profile image from MinIO if exists
    if (user.imageUrl) {
      await this.minioService.deleteFile(user.imageUrl).catch(() => {});
    }

    await this.prisma.user.delete({ where: { userId } });
    return { message: 'Account deleted successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: { userId: userId},
    });
    if (!user) throw new ConflictException('User not found');

    if (!user.password) {
      throw new ConflictException('you can not change password for Google accounts, please use Google sign in instead.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) throw new ConflictException('Invalid password');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { userId: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password changed successfully' };
  }

  async getPosts(){
    return this.prisma.post.findMany({
      where:{
        isPublished: true,
       },
       select:{
        postId: true,
        title: true,
        createdAt: true,
        url: true,
        type: true,
        description: true,
        specialist:{
          select:{
            user:{
              select:{
                fullName: true,
                imageUrl: true,
              }
            }
          }
        }
      },
      orderBy:{
        createdAt: 'desc',
      }
    })
  }
}
