import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'startup' })
export class Startup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'legal_status', type: 'varchar', length: 255, nullable: true })
  legalStatus?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 255 }) 
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string | null;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl?: string | null;

  @Column({ name: 'social_media_url', type: 'varchar', length: 255, nullable: true })
  socialMediaUrl?: string | null;

  @Column({ name: 'project_status', type: 'varchar', length: 100, nullable: true })
  projectStatus?: string | null;

  @Column({ type: 'text', nullable: true })
  needs?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sector?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  maturity?: string | null;
}
