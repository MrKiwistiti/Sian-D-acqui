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
