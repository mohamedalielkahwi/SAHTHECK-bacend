import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse } from './response/SignInResponse';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createUserDto) {
    const { fullName, email, password, phone, gender, role, age } =
      createUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(email, password, fullName);
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
    const token = this.jwtService.signAsync(
      {
        email: user.email,
        id: user.userId.toString(),
      },
      { expiresIn: '1h' },
    );
    const response = new SignInResponse();
    response.accessToken = (await token).toString();
    return response;
  }
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) throw new ConflictException('User not found');
    await this.prisma.patient.delete({
      where: {
        userId,
      },
    });
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
      },
    });
    if (!user) throw new ConflictException('User not found');
    return user;
  }
}
