import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'news' })
export class News {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'news_date', type: 'timestamp', nullable: true })
  newsDate?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'startupId', type: 'int', nullable: true })
  startupId?: number | null;
}
