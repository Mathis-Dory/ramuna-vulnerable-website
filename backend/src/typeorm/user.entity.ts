import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document.entity';
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
    name: 'phoneNumber',
  })
  phoneNumber: string;

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
    default: '',
    name: 'role',
  })
  role: string;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];
}
