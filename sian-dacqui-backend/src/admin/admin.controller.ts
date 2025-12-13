import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('admin')
export class AdminController {
  constructor(private readonly dataSource: DataSource) {}

  @Post('init-db')
  async initDatabase() {
    try {
      const sql = `
-- Create tables for pizzeria app
CREATE TABLE IF NOT EXISTS pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50) DEFAULT 'medium',
    available BOOLEAN DEFAULT true,
    "imageUrl" VARCHAR(500),
    "preparationTime" INTEGER DEFAULT 0,
    vegetarian BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    allergen BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizza_id INTEGER NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (pizza_id, ingredient_id)
);

-- Insert pizzas
INSERT INTO pizzas (id, name, description, price, vegetarian, available, "preparationTime") VALUES
(1, 'La Marguerite', 'La pizza classique italienne par excellence', 10.00, true, true, 12),
(2, 'La Regina', 'Une pizza généreuse et savoureuse', 13.00, false, true, 15),
(3, 'La Napo', 'L''authentique pizza napolitaine', 14.00, false, true, 15),
(4, 'La Calabrese', 'Pizza épicée aux saveurs du sud', 14.00, false, true, 15),
(5, 'La 4 Fromages', 'Pour les amateurs de fromage', 13.50, true, true, 14),
(6, 'La Salmone', 'Pizza raffinée au saumon', 15.50, false, true, 16),
(7, 'La Vegetariana', 'Un festival de légumes frais', 13.00, true, true, 14),
(8, 'La Campagnola', 'Pizza rustique et généreuse', 14.50, false, true, 16),
(9, 'La Marinara', 'La plus simple et authentique', 9.00, true, true, 10),
(10, 'La Calzone', 'Pizza fermée garnie', 14.00, false, true, 18),
(11, 'La Diavola', 'Pizza piquante pour les audacieux', 13.50, false, true, 15),
(12, 'La Capricciosa', 'Pizza aux multiples saveurs', 14.50, false, true, 16),
(13, 'La Prosciutto e Funghi', 'Jambon et champignons', 13.50, false, true, 15),
(14, 'La Tonno', 'Pizza au thon', 13.00, false, true, 14),
(15, 'La Parmigiana', 'Aux aubergines et parmesan', 13.50, true, true, 15),
(16, 'La Siciliana', 'Saveurs de Sicile', 14.00, false, true, 15)
ON CONFLICT (name) DO NOTHING;

-- Reset sequence
SELECT setval('pizzas_id_seq', (SELECT MAX(id) FROM pizzas));

-- Insert sample ingredients
INSERT INTO ingredients (name, allergen) VALUES
('Sauce tomate', false),
('Mozzarella', true),
('Basilic', false),
('Jambon', false),
('Champignons', false),
('Anchois', true),
('Salami piquant', false),
('Gorgonzola', true),
('Saumon fumé', true),
('Légumes grillés', false),
('Œuf', true),
('Olives', false),
('Ail', false),
('Thon', true),
('Aubergines', false),
('Parmesan', true)
ON CONFLICT (name) DO NOTHING;

-- Link pizzas with ingredients (examples)
INSERT INTO pizza_ingredients (pizza_id, ingredient_id) 
SELECT 1, id FROM ingredients WHERE name IN ('Sauce tomate', 'Mozzarella', 'Basilic')
ON CONFLICT DO NOTHING;

INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
SELECT 2, id FROM ingredients WHERE name IN ('Sauce tomate', 'Mozzarella', 'Jambon', 'Champignons')
ON CONFLICT DO NOTHING;
      `;
      
      await this.dataSource.query(sql);
      
      return {
        success: true,
        message: 'Database initialized successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('update-real-pizzas')
  async updateRealPizzas() {
    try {
      const sql = `
-- Suppression des anciennes pizzas
TRUNCATE TABLE pizza_ingredients CASCADE;
TRUNCATE TABLE pizzas CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Réinitialisation des séquences
ALTER SEQUENCE pizzas_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;

-- Insertion des vraies pizzas (sans images pour l'instant)
INSERT INTO pizzas (id, name, description, price, size, available, "imageUrl", "preparationTime", vegetarian, "createdAt", "updatedAt") VALUES
(1, 'La Marguerite', 'La pizza classique italienne par excellence, simple et authentique.', 10.00, 'medium', true, null, 12, true, NOW(), NOW()),
(2, 'La Regina', 'Une pizza généreuse et savoureuse, parfaite pour les amateurs de classiques.', 13.00, 'medium', true, null, 15, false, NOW(), NOW()),
(3, 'La Napo', 'L''authentique pizza napolitaine, simple mais savoureuse avec ses anchois fins.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(4, 'La Caprese', 'Une variation caprese avec anchois et câpres.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(5, 'La 4 Saisons', 'Une pizza classique avec quatre saisons de saveurs différentes.', 14.00, 'medium', true, null, 16, false, NOW(), NOW()),
(6, 'La Chevre Miel', 'Une pizza gourmande avec chèvre, miel et crème de balsamique.', 14.00, 'medium', true, null, 14, true, NOW(), NOW()),
(7, 'La Calabrese', 'Une pizza épicée avec spianata et guanciale.', 15.00, 'medium', true, null, 15, false, NOW(), NOW()),
(8, 'La Calzone', 'Un calzone traditionnel avec œuf et jambon.', 14.00, 'medium', true, null, 18, false, NOW(), NOW()),
(9, 'La 4 Fromages', 'Une pizza riche et savoureuse avec quatre fromages différents.', 14.00, 'medium', true, null, 14, true, NOW(), NOW()),
(10, 'La Merguez', 'Une pizza savoureuse avec merguez du boucher et olives.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(11, 'La Cannibale', 'Une pizza généreuse avec viande hachée Angus, poivrons et sauce chimichuri.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(12, 'La Lily-Rose', 'Une pizza raffinée avec burrata, mortadelle et finitions fraîches.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(13, 'La Emmy-Lou', 'Une pizza légère avec courgettes, ricotta et pistou.', 15.00, 'medium', true, null, 15, true, NOW(), NOW()),
(14, 'La Chris', 'Une pizza végétale avec aubergines, courgettes et jambon cru en finition.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(15, 'La Ludmilove', 'Une pizza raffinée avec roquette et jambon de Parme.', 15.00, 'medium', true, null, 15, false, NOW(), NOW()),
(16, 'La Truffe', 'Une pizza luxueuse avec jambon truffé et ricotta de buffala.', 20.00, 'medium', true, null, 18, false, NOW(), NOW());

-- Insertion de quelques ingrédients de base
INSERT INTO ingredients (name, allergen, "createdAt", "updatedAt") VALUES
('Sauce tomate', false, NOW(), NOW()),
('Mozzarella', true, NOW(), NOW()),
('Basilic', false, NOW(), NOW()),
('Jambon', false, NOW(), NOW()),
('Champignons', false, NOW(), NOW()),
('Origan', false, NOW(), NOW()),
('Olives', false, NOW(), NOW()),
('Anchois', false, NOW(), NOW()),
('Ail', false, NOW(), NOW()),
('Câpres', false, NOW(), NOW());

-- Réinitialiser les séquences après insertion
SELECT setval('pizzas_id_seq', (SELECT MAX(id) FROM pizzas));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients));
      `;
      
      await this.dataSource.query(sql);
      
      return {
        success: true,
        message: 'Real pizzas updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('update-pizza-images')
  async updatePizzaImages() {
    try {
      await this.dataSource.query(`
        UPDATE pizzas SET "imageUrl" = '/images/pizzas/calzone.jpg' WHERE name = 'La Calzone';
        UPDATE pizzas SET "imageUrl" = '/images/pizzas/regina.jpg' WHERE name = 'La Regina';
      `);
      
      return {
        success: true,
        message: 'Pizza images updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
