import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'investor' })
export class Investor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'legal_status', type: 'varchar', length: 255, nullable: true })
  legalStatus?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string | null;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'investor_type', type: 'varchar', length: 100, nullable: true })
  investorType?: string | null;

  @Column({ name: 'investment_focus', type: 'varchar', length: 255, nullable: true })
  investmentFocus?: string | null;
}
