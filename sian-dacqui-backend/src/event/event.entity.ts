import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  dates?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'event_type', type: 'varchar', length: 100, nullable: true })
  eventType?: string | null;

  @Column({ name: 'target_audience', type: 'varchar', length: 255, nullable: true })
  targetAudience?: string | null;
}
