import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Request, (request) => request.documents)
  request: Request;
}
