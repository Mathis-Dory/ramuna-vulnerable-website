import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../../dto/users.dtos';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('/users')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('id/:id')
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUsersById(id);
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  registerUser(@Body() createUserDto: RegisterUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async Signup(@Res() response, @Body() createUserDto: RegisterUserDto) {
    const newUSer = await this.userService.signup(createUserDto);
    if (!newUSer) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'User already exists with this mail',
      });
    }
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }
  @Post('/signIn')
  @UsePipes(ValidationPipe)
  async SignIn(@Res() response, @Body() loginUserDto: LoginUserDto) {
    const token = await this.userService.signin(loginUserDto, this.jwtService);
    if (!token) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'Incorrect email or password!',
      });
    }
    return response.status(HttpStatus.OK).json(token);
  }
}
