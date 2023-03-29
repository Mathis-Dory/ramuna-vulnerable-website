import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { LoginUserDto, RegisterUserDto } from '../../dto/users.dtos';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: RegisterUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  findUsersById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findUsersByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async updateToken(newToken: string, existingUser: User) {
    await this.userRepository.save({ ...existingUser, token: newToken });
  }

  async signup(createUserDto: RegisterUserDto): Promise<User | any> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      return new HttpException(
        'User already exists with this email address',
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      const newUser = this.userRepository.create(createUserDto);
      return this.userRepository.save({ ...newUser, password: hash });
    }
  }

  async signin(userCredentials: LoginUserDto, jwt: JwtService): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({
      email: userCredentials.email,
    });
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(userCredentials.password, password)) {
        const payload = { email: userCredentials.email };
        const token = jwt.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '3h',
        });
        await this.updateToken(token, foundUser);
        return {
          token,
        };
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'No user matching these credentials was found!',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
