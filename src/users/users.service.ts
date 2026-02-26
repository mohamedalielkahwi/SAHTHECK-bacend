import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse } from './response/SignInResponse';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async createUser(createUserDto) {
    const { email, password, name } = createUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(email, password, name);
    if (user) throw new ConflictException('User already exists');
    const hashedPassword = await this.hashPassword(password);
    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
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
        id: user.id,
      },
      { expiresIn: '1h' },
    );
    const response = new SignInResponse();
    response.accessToken = (await token).toString();
    return response;
  }
}
