import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';

@Controller('pizzas')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.create(createPizzaDto);
  }

  @Get()
  findAll() {
    return this.pizzaService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.pizzaService.findAvailable();
  }

  @Get('vegetarian')
  findVegetarian() {
    return this.pizzaService.findVegetarian();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pizzaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePizzaDto: UpdatePizzaDto) {
    return this.pizzaService.update(+id, updatePizzaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pizzaService.remove(+id);
  }

  @Post(':pizzaId/ingredients/:ingredientId')
  addIngredient(
    @Param('pizzaId') pizzaId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.pizzaService.addIngredient(+pizzaId, +ingredientId);
  }

  @Delete(':pizzaId/ingredients/:ingredientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeIngredient(
    @Param('pizzaId') pizzaId: string,
    @Param('ingredientId') ingredientId: string,
  ) {
    return this.pizzaService.removeIngredient(+pizzaId, +ingredientId);
  }
}
