-- Suppression des anciennes pizzas
TRUNCATE TABLE pizza_ingredients CASCADE;
TRUNCATE TABLE pizzas RESTART IDENTITY CASCADE;

-- Insertion des pizzas originales de Sian D'Acqui
INSERT INTO pizzas (name, description, price, size, available, vegetarian, "imageUrl", "preparationTime") VALUES
('La Marguerite', 'Tomate, mozzarella, basilic frais', 10.00, 'medium', true, true, null, 15),
('La Regina', 'Tomate, mozzarella, jambon, champignons', 13.00, 'medium', true, false, null, 15),
('La Napo', 'Tomate, mozzarella, anchois, câpres, olives', 14.00, 'medium', true, false, null, 15),
('La Caprese', 'Tomate, mozzarella di bufala, tomates cerises, roquette', 14.00, 'medium', true, true, null, 15),
('La 4 Saisons', 'Tomate, mozzarella, jambon, champignons, artichauts, olives', 14.00, 'medium', true, false, null, 18),
('La Chevre Miel', 'Crème fraîche, mozzarella, fromage de chèvre, miel', 14.00, 'medium', true, true, null, 15),
('La Calabrese', 'Tomate, mozzarella, salami piquant, poivrons, oignons', 15.00, 'medium', true, false, null, 15),
('La Calzone', 'Pizza fermée: tomate, mozzarella, jambon, champignons, œuf', 14.00, 'medium', true, false, null, 20),
('La 4 Fromages', 'Crème fraîche, mozzarella, gorgonzola, chèvre, parmesan', 14.00, 'medium', true, true, null, 15),
('La Merguez', 'Tomate, mozzarella, merguez, poivrons, oignons', 14.00, 'medium', true, false, null, 15),
('La Cannibale', 'Tomate, mozzarella, viande hachée, chorizo, lardons, œuf', 15.00, 'medium', true, false, null, 18),
('La Lily-Rose', 'Crème fraîche, mozzarella, saumon fumé, citron, aneth', 15.00, 'medium', true, false, null, 15),
('La Emmy-Lou', 'Tomate, mozzarella, jambon cru, roquette, copeaux parmesan', 15.00, 'medium', true, false, null, 15),
('La Chris', 'Crème fraîche, mozzarella, poulet mariné, champignons, curry', 15.00, 'medium', true, false, null, 18),
('La Ludmilove', 'Tomate, mozzarella, légumes grillés, pesto', 15.00, 'medium', true, true, null, 15),
('La Truffe', 'Crème fraîche, mozzarella, champignons, huile de truffe', 20.00, 'medium', true, true, null, 15);

-- Affichage des pizzas insérées
SELECT id, name, price, vegetarian FROM pizzas ORDER BY id;
