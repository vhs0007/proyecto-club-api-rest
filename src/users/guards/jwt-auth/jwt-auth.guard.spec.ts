import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  const mockJwtService = {
    verify: jest.fn(),
  };

  let guard: AuthGuard;

  const createMockContext = (headers: Record<string, string> = {}): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(mockJwtService as unknown as JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException when no Authorization header', () => {
    const context = createMockContext({});

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('No token provided');
    expect(mockJwtService.verify).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when header does not start with Bearer ', () => {
    const context = createMockContext({ authorization: 'InvalidFormat token' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('No token provided');
    expect(mockJwtService.verify).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when token is invalid or expired', () => {
    const context = createMockContext({ authorization: 'Bearer invalid-token' });
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Invalid or expired token');
    expect(mockJwtService.verify).toHaveBeenCalledWith('invalid-token');
  });

  it('should return true and set request.user when token is valid', () => {
    const payload = { sub: 1, email: 'admin@admin.com', role: 'admin' };
    const request = { headers: { authorization: 'Bearer valid-token' }, user: null };
    mockJwtService.verify.mockReturnValue(payload);

    const result = guard.canActivate(createMockContext({ authorization: 'Bearer valid-token' }));

    expect(result).toBe(true);
    expect(request.user).toEqual(payload);
  });
});
