import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Pizza } from '../pizza/pizza.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToMany(() => Pizza, pizza => pizza.ingredients)
  pizzas: Pizza[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
