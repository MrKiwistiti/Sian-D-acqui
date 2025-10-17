import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'api_id', type: 'int', nullable: true })
  apiId?: number | null;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  role!: string;

  @Column({ name: 'founderId', type: 'int', nullable: true })
  founderId?: number | null;

  @Column({ name: 'investorId', type: 'int', nullable: true })
  investorId?: number | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: false })
  passwordHash!: string;

  @Column({ name: 'must_change_password', type: 'boolean', default: false })
  mustChangePassword!: boolean;
}
