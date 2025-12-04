import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pizza } from './pizza.entity';
import { PizzaService } from './pizza.service';
import { PizzaController } from './pizza.controller';
import { IngredientModule } from '../ingredient/ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pizza]),
    IngredientModule,
  ],
  controllers: [PizzaController],
  providers: [PizzaService],
  exports: [PizzaService],
})
export class PizzaModule {}
