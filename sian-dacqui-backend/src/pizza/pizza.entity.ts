import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';

@Entity('pizzas')
export class Pizza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'medium' })
  size: string;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  preparationTime: number; // en minutes

  @Column({ default: false })
  vegetarian: boolean;

  @ManyToMany(() => Ingredient, ingredient => ingredient.pizzas)
  @JoinTable({
    name: 'pizza_ingredients',
    joinColumn: { name: 'pizza_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ingredient_id', referencedColumnName: 'id' }
  })
  ingredients: Ingredient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
