import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() } as any;
    configService = { get: jest.fn().mockReturnValue('test_secret') } as any;
    guard = new AuthGuard(jwtService, configService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true if token is valid', async () => {
    const mockPayload = { sub: 1, email: 'test@test.com' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);

    const mockRequest = { headers: { authorization: 'Bearer validtoken' }, user: null };
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockPayload);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('invalid token'));

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer invalidtoken' } }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});