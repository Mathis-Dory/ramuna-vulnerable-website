import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column('bytea', { nullable: true })
  pdf: Buffer;
  @Column('bytea', { nullable: true })
  image: Buffer;

  @Column({
    nullable: false,
    default: '',
    name: 'status',
  })
  status: string;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => User, (user) => user.requests, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'asigneeId' })
  asigneeId: number;

  @OneToMany(() => Document, (document) => document.request)
  documents: Document[];
}
