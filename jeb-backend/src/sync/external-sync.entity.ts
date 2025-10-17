import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'external_sync' })
@Index(['entity', 'apiId'], { unique: true })
export class ExternalSync {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ type: 'varchar', length: 50 }) entity!: string;
  @Column({ name: 'api_id', type: 'int' }) apiId!: number;

  @Column({ name: 'local_id', type: 'int', nullable: true }) localId?: number | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) etag?: string | null;
  @Column({ name: 'last_modified', type: 'timestamp', nullable: true }) lastModified?: Date | null;

  @Column({ name: 'fetched_at', type: 'timestamp', default: () => 'NOW()' }) fetchedAt!: Date;
}
