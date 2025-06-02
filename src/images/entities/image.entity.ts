import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column()
  src: string;
}
