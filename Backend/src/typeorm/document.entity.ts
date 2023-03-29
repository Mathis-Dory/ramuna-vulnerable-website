import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
    name: 'type',
  })
  type: string;

  @Column({
    nullable: false,
    default: '',
    name: 'status',
  })
  status: string;

  @Column('jsonb', {
    nullable: false,
    default: {},
  })
  rawData: string;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
