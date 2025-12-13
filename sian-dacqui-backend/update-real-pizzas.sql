-- Suppression des anciennes pizzas
TRUNCATE TABLE pizza_ingredients CASCADE;
TRUNCATE TABLE pizzas CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Réinitialisation des séquences
ALTER SEQUENCE pizzas_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;

-- Insertion des vraies pizzas
INSERT INTO pizzas (id, name, description, price, size, available, "imageUrl", "preparationTime", vegetarian, "createdAt", "updatedAt") VALUES
(1, 'La Marguerite', 'La pizza classique italienne par excellence, simple et authentique.', 10.00, 'medium', true, '/images/pizzas/marguerite.jpg', 12, true, NOW(), NOW()),
(2, 'La Regina', 'Une pizza généreuse et savoureuse, parfaite pour les amateurs de classiques.', 13.00, 'medium', true, '/images/pizzas/regina.jpg', 15, false, NOW(), NOW()),
(3, 'La Napo', 'L''authentique pizza napolitaine, simple mais savoureuse avec ses anchois fins.', 14.00, 'medium', true, '/images/pizzas/napolitaine.jpg', 15, false, NOW(), NOW()),
(4, 'La Caprese', 'Une variation caprese avec anchois et câpres.', 14.00, 'medium', true, '/images/pizzas/caprese.jpg', 15, false, NOW(), NOW()),
(5, 'La 4 Saisons', 'Une pizza classique avec quatre saisons de saveurs différentes.', 14.00, 'medium', true, '/images/pizzas/4saisons.jpg', 16, false, NOW(), NOW()),
(6, 'La Chevre Miel', 'Une pizza gourmande avec chèvre, miel et crème de balsamique.', 14.00, 'medium', true, '/images/pizzas/chevre-miel.jpg', 14, true, NOW(), NOW()),
(7, 'La Calabrese', 'Une pizza épicée avec spianata et guanciale.', 15.00, 'medium', true, '/images/pizzas/calabrese.jpg', 15, false, NOW(), NOW()),
(8, 'La Calzone', 'Un calzone traditionnel avec œuf et jambon.', 14.00, 'medium', true, '/images/pizzas/calzone.jpg', 18, false, NOW(), NOW()),
(9, 'La 4 Fromages', 'Une pizza riche et savoureuse avec quatre fromages différents.', 14.00, 'medium', true, '/images/pizzas/4fromages.jpg', 14, true, NOW(), NOW()),
(10, 'La Merguez', 'Une pizza savoureuse avec merguez du boucher et olives.', 14.00, 'medium', true, '/images/pizzas/merguez.jpg', 15, false, NOW(), NOW()),
(11, 'La Cannibale', 'Une pizza généreuse avec viande hachée Angus, poivrons et sauce chimichuri.', 15.00, 'medium', true, '/images/pizzas/cannibale.jpg', 16, false, NOW(), NOW()),
(12, 'La Lily-Rose', 'Une pizza raffinée avec burrata, mortadelle et finitions fraîches.', 15.00, 'medium', true, '/images/pizzas/lily-rose.jpg', 16, false, NOW(), NOW()),
(13, 'La Emmy-Lou', 'Une pizza légère avec courgettes, ricotta et pistou.', 15.00, 'medium', true, '/images/pizzas/emmy-lou.jpg', 15, true, NOW(), NOW()),
(14, 'La Chris', 'Une pizza végétale avec aubergines, courgettes et jambon cru en finition.', 15.00, 'medium', true, '/images/pizzas/chris.jpg', 16, false, NOW(), NOW()),
(15, 'La Ludmilove', 'Une pizza raffinée avec roquette et jambon de Parme.', 15.00, 'medium', true, '/images/pizzas/ludmilove.jpg', 15, false, NOW(), NOW()),
(16, 'La Truffe', 'Une pizza luxueuse avec jambon truffé et ricotta de buffala.', 20.00, 'medium', true, '/images/pizzas/truffe.jpg', 18, false, NOW(), NOW());

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
