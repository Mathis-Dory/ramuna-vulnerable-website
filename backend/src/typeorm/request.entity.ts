import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column('jsonb', {
    nullable: false,
    default: {},
  })
  data: any;

  @ManyToOne(() => User, (user) => user.requests)
  user: User;
}
