import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'founder' })
export class Founder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'startupId', type: 'int', nullable: true })
  startupId?: number | null;
}
