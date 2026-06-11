import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth') 
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувача успішно зареєстровано' })
  @ApiResponse({ status: 400, description: 'Користувач з таким Email вже існує або помилка валідації' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизація користувача (вхід)' })
  @ApiResponse({ status: 200, description: 'Успішний вхід. Повертає JWT токен access_token' })
  @ApiResponse({ status: 401, description: 'Неправильний email або пароль' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}