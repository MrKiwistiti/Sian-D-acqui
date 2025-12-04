import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pizza } from './pizza.entity';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { Ingredient } from '../ingredient/ingredient.entity';

@Injectable()
export class PizzaService {
  constructor(
    @InjectRepository(Pizza)
    private pizzaRepository: Repository<Pizza>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createPizzaDto: CreatePizzaDto): Promise<Pizza> {
    const { ingredientIds, ...pizzaData } = createPizzaDto;
    
    const pizza = this.pizzaRepository.create(pizzaData);
    
    if (ingredientIds && ingredientIds.length > 0) {
      pizza.ingredients = await this.ingredientRepository.find({
        where: { id: In(ingredientIds) }
      });
    }
    
    return this.pizzaRepository.save(pizza);
  }

  async findAll(): Promise<Pizza[]> {
    return this.pizzaRepository.find({
      relations: ['ingredients'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Pizza> {
    const pizza = await this.pizzaRepository.findOne({
      where: { id },
      relations: ['ingredients']
    });
    
    if (!pizza) {
      throw new NotFoundException(`Pizza with ID ${id} not found`);
    }
    
    return pizza;
  }

  async update(id: number, updatePizzaDto: UpdatePizzaDto): Promise<Pizza> {
    const pizza = await this.findOne(id);
    const { ingredientIds, ...pizzaData } = updatePizzaDto;
    
    Object.assign(pizza, pizzaData);
    
    if (ingredientIds !== undefined) {
      if (ingredientIds.length > 0) {
        pizza.ingredients = await this.ingredientRepository.find({
          where: { id: In(ingredientIds) }
        });
      } else {
        pizza.ingredients = [];
      }
    }
    
    return this.pizzaRepository.save(pizza);
  }

  async remove(id: number): Promise<void> {
    const pizza = await this.findOne(id);
    await this.pizzaRepository.remove(pizza);
  }

  async findAvailable(): Promise<Pizza[]> {
    return this.pizzaRepository.find({
      where: { available: true },
      relations: ['ingredients'],
      order: { name: 'ASC' }
    });
  }

  async addIngredient(pizzaId: number, ingredientId: number): Promise<Pizza> {
    const pizza = await this.findOne(pizzaId);
    const ingredient = await this.ingredientRepository.findOne({
      where: { id: ingredientId }
    });
    
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found`);
    }
    
    if (!pizza.ingredients.find(ing => ing.id === ingredientId)) {
      pizza.ingredients.push(ingredient);
      await this.pizzaRepository.save(pizza);
    }
    
    return pizza;
  }

  async removeIngredient(pizzaId: number, ingredientId: number): Promise<Pizza> {
    const pizza = await this.findOne(pizzaId);
    pizza.ingredients = pizza.ingredients.filter(ing => ing.id !== ingredientId);
    return this.pizzaRepository.save(pizza);
  }
}
