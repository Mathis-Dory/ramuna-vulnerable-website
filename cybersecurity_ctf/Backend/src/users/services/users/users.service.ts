import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm';
import { LoginUserDto, RegisterUserDto } from '../../dto/users.dtos';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRoles, UserStatus } from '../../user.enums';

@Injectable()
export class UsersService {
  usersRepository: any;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  async getAdminUsers() {
    return this.userRepository.find({ where: { role: UserRoles.ADMIN } });
  }

  async findUsersById(id: any) {
    const queryString = `
    SELECT * FROM "user"
    WHERE "id" = ${id}
  `;
    try {
      const results = await this.userRepository.manager.query(queryString);
      console.log('Results:', results);
      return results;
    } catch (error) {
      console.error('Error executing the query:', error);
      throw error;
    }
  }

  findUsersByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async getUserIdFromJwt(token: string) {
    const user = await this.userRepository.findOneBy({
      token: token.split('Bearer ')[1],
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user.id;
  }

  async updateToken(newToken: string, existingUser: User) {
    await this.userRepository.save({ ...existingUser, token: newToken });
  }

  async updateUserStatus(status: string, existingUser: User) {
    await this.userRepository.save({ ...existingUser, status });
  }

  async signup(createUserDto: RegisterUserDto): Promise<User | any> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      return false;
    } else {
      const newUser = this.userRepository.create(createUserDto);
      return this.userRepository.save({
        ...newUser,
        password: hash,
        role: UserRoles.USER,
        status: UserStatus.ACTIVE,
      });
    }
  }

  async signin(userCredentials: LoginUserDto, jwt: JwtService): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({
      email: userCredentials.email,
    });
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(userCredentials.password, password)) {
        const payload = { email: userCredentials.email, role: foundUser.role };
        const token = jwt.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '3h',
        });
        await this.updateToken(token, foundUser);
        const userId = foundUser.id;
        const userName = foundUser.firstName;
        return {
          token,
          userId,
          userName,
        };
      }
      return false;
    }
    return false;
  }
}
