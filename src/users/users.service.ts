import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse } from './response/SignInResponse';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}
  async createUser(createUserDto) {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      role,
      age,
      speciality,
      bio,
      licenseNumber,
      isValidated,
    } = createUserDto;

    if (role === 'DOCTOR' && (!speciality || !bio || !licenseNumber)) {
      throw new ConflictException(
        'Speciality, bio and license number are required for doctors',
      );
    }
    if (role === 'PATIENT' && !age) {
      throw new ConflictException('Age is required for patients');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) throw new ConflictException('User already exists');
    const hashedPassword = await this.hashPassword(password);
    return this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        gender,
        role,
        patient:
          role === 'PATIENT'
            ? {
                create: {
                  age: Number.parseInt(age),
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
                  isValidated,
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
        role: true,
        patient: {
          select: {
            age: true,
          },
        },
        specialist: {
          select: {
            speciality: true,
            bio: true,
            licenseNumber: true,
            isValidated: true,
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
  async signIn(signInDto): Promise<SignInResponse> {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ConflictException('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ConflictException('Invalid credentials');
    const payload = {
      email: user.email,
      userId: user.userId.toString(),
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
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
        role: true,
        patient: {
          select: {
            age: true,
          },
        },
        specialist: {
          select: {
            speciality: true,
            bio: true,
            licenseNumber: true,
            isValidated: true,
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
        id: payload.id,
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
    return { message: 'Doctor validated successfully' };
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
    return { message: 'Admin validated successfully' };
  }
}
