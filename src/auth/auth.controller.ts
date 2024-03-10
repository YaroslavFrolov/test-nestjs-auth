import { Controller, Post, Body, UsePipes, HttpCode } from '@nestjs/common';
import {
  LoginDTO,
  loginSchema,
  TokensDTO,
  RegisterDTO,
  registerSchema,
  RefreshDTO,
  refreshSchema,
} from './auth.dto';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from './validation.pipe';
import { PublicDecorator } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @PublicDecorator()
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterDTO): Promise<number> {
    return this.authService.register(body);
  }

  @Post('sign-in')
  @HttpCode(200)
  @PublicDecorator()
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDTO): Promise<TokensDTO> {
    return this.authService.login(body);
  }

  @Post('refresh-tokens')
  @PublicDecorator()
  @UsePipes(new ZodValidationPipe(refreshSchema))
  async refresh(@Body() body: RefreshDTO): Promise<TokensDTO> {
    return this.authService.refresh(body);
  }

  @Post('sign-out')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(refreshSchema))
  async logout(@Body() body: RefreshDTO): Promise<string> {
    await this.authService.logout(body);
    return 'Session removed. Please remove access-token on client-side too.';
  }

  @Post('sign-out-all')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(refreshSchema))
  async logoutAll(@Body() body: RefreshDTO): Promise<string> {
    await this.authService.logoutAll(body);
    return 'All sessions removed. Wait until all access-tokens will expire.';
  }
}
