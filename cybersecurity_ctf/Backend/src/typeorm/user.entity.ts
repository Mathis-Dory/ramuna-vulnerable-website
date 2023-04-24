import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from './request.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
    name: 'email',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
    name: 'firstName',
  })
  firstName: string;

  @Column({
    nullable: false,
    default: '',
    name: 'lastName',
  })
  lastName: string;

  @Column({
    nullable: false,
    default: '',
    name: 'sex',
  })
  sex: string;

  @Column({
    nullable: false,
    default: '',
    name: 'citizenship',
  })
  citizenship: string;

  @Column({
    nullable: false,
    default: '',
    name: 'token',
  })
  token: string;

  @Column({
    nullable: false,
    default: '',
    name: 'password',
  })
  password: string;

  @Column({
    nullable: false,
    default: '',
    name: 'status',
  })
  status: string;

  @Column('jsonb', {
    nullable: true,
    default: {},
  })
  extra: any;

  @Column({
    nullable: true,
    default: 'user',
    name: 'role',
  })
  role: string;

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];
}
