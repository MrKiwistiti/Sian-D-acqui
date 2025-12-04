import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER ?? process.env.DB_USERNAME,
  password: process.env.DB_PASS ?? process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Créer des ingrédients
    const ingredients = [
      { name: 'Sauce Tomate', description: 'Sauce tomate maison', price: 0, available: true },
      { name: 'Mozzarella', description: 'Fromage mozzarella italien', price: 1.5, available: true },
      { name: 'Basilic', description: 'Basilic frais', price: 0.5, available: true },
      { name: 'Jambon', description: 'Jambon de qualité', price: 2, available: true },
      { name: 'Champignons', description: 'Champignons frais', price: 1.5, available: true },
      { name: 'Olives', description: 'Olives noires', price: 1, available: true },
      { name: 'Poivrons', description: 'Poivrons frais', price: 1, available: true },
      { name: 'Oignons', description: 'Oignons rouges', price: 0.5, available: true },
      { name: 'Anchois', description: 'Anchois salés', price: 2, available: true },
      { name: 'Pepperoni', description: 'Saucisse épicée', price: 2.5, available: true },
      { name: 'Roquette', description: 'Roquette fraîche', price: 1, available: true },
      { name: 'Parmesan', description: 'Fromage parmesan', price: 2, available: true },
      { name: 'Gorgonzola', description: 'Fromage bleu italien', price: 2.5, available: true },
      { name: 'Chèvre', description: 'Fromage de chèvre', price: 2.5, available: true },
    ];

    console.log('🌿 Creating ingredients...');
    for (const ing of ingredients) {
      await AppDataSource.query(
        `INSERT INTO ingredients (name, description, price, available, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, NOW(), NOW()) 
         ON CONFLICT (name) DO NOTHING`,
        [ing.name, ing.description, ing.price, ing.available]
      );
    }
    console.log('✅ Ingredients created');

    // Récupérer les IDs des ingrédients
    const ingredientIds: any = await AppDataSource.query(
      'SELECT id, name FROM ingredients ORDER BY id'
    );
    const idMap: Record<string, number> = {};
    ingredientIds.forEach((ing: any) => {
      idMap[ing.name] = ing.id;
    });

    // Créer des pizzas
    const pizzas = [
      {
        name: 'Margherita',
        description: 'La pizza classique italienne : tomate, mozzarella, basilic',
        price: 11.50,
        size: 'medium',
        preparationTime: 12,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Basilic'],
      },
      {
        name: 'Regina',
        description: 'Pizza avec jambon et champignons',
        price: 13.50,
        size: 'medium',
        preparationTime: 15,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Jambon', 'Champignons'],
      },
      {
        name: 'Napolitaine',
        description: 'Pizza aux anchois, câpres et olives',
        price: 12.50,
        size: 'medium',
        preparationTime: 13,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Anchois', 'Olives'],
      },
      {
        name: 'Quatre Fromages',
        description: 'Un délice de fromages fondants',
        price: 14.50,
        size: 'medium',
        preparationTime: 14,
        ingredients: ['Mozzarella', 'Gorgonzola', 'Parmesan', 'Chèvre'],
      },
      {
        name: 'Végétarienne',
        description: 'Pizza garnie de légumes frais',
        price: 13.00,
        size: 'medium',
        preparationTime: 15,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Poivrons', 'Champignons', 'Olives', 'Oignons'],
      },
      {
        name: 'Diavola',
        description: 'Pizza épicée au pepperoni',
        price: 14.00,
        size: 'medium',
        preparationTime: 13,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Pepperoni', 'Oignons'],
      },
      {
        name: 'Paysanne',
        description: 'Pizza campagnarde avec jambon et champignons',
        price: 14.50,
        size: 'medium',
        preparationTime: 16,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Jambon', 'Champignons', 'Oignons', 'Poivrons'],
      },
      {
        name: 'Rucola',
        description: 'Pizza à la roquette et parmesan',
        price: 15.00,
        size: 'medium',
        preparationTime: 14,
        ingredients: ['Sauce Tomate', 'Mozzarella', 'Roquette', 'Parmesan'],
      },
    ];

    console.log('🍕 Creating pizzas...');
    for (const pizza of pizzas) {
      // Insérer la pizza
      const result = await AppDataSource.query(
        `INSERT INTO pizzas (name, description, price, size, "preparationTime", available, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [pizza.name, pizza.description, pizza.price, pizza.size, pizza.preparationTime, true]
      );

      if (result.length > 0) {
        const pizzaId = result[0].id;

        // Associer les ingrédients
        for (const ingName of pizza.ingredients) {
          const ingId = idMap[ingName];
          if (ingId) {
            await AppDataSource.query(
              `INSERT INTO pizza_ingredients (pizza_id, ingredient_id) 
               VALUES ($1, $2) 
               ON CONFLICT DO NOTHING`,
              [pizzaId, ingId]
            );
          }
        }
      }
    }
    console.log('✅ Pizzas created');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📊 Created:`);
    console.log(`   - ${ingredients.length} ingredients`);
    console.log(`   - ${pizzas.length} pizzas`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
