import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';
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
    name: 'documentType',
  })
  documentType: string;

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

  @Column({ name: 'requestId' })
  requestId: number;

  @ManyToOne(() => Request, (request) => request.documents, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'requestId' })
  request: Request;
}
