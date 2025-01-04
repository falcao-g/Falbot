const items = [
	{
		id: 'log',
		name: {
			'en-US': 'Big Log',
			'pt-BR': 'Madeira',
			'es-ES': 'Madera',
		},
		value: 300,
		rarity: 'Common',
		emoji: '🪵',
		exploring: true,
	},
	{
		id: 'wool',
		name: {
			'en-US': 'Woll',
			'pt-BR': 'Lã',
			'es-ES': 'Lana',
		},
		value: 700,
		rarity: 'Rare',
		emoji: '🐏',
		hunting: true,
	},
	{
		id: 'tools',
		name: {
			'en-US': 'Work tools',
			'pt-BR': 'Ferramentas',
			'es-ES': 'Herramientas',
		},
		value: 1800,
		emoji: '🛠️',
		recipe: {
			log: 2,
			scrap: 4,
		},
	},
	{
		id: 'boot',
		name: {
			'en-US': 'Old Boot',
			'pt-BR': 'Bota Velha',
			'es-ES': 'Bota Vieja',
		},
		value: 10,
		rarity: 'Common',
		emoji: '🥾',
		fishing: true,
	},
	{
		id: 'anchovy',
		name: {
			'en-US': 'Anchovy',
			'pt-BR': 'Anchova',
			'es-ES': 'Anchoa',
		},
		value: 50,
		rarity: 'Common',
		emoji: '🐟',
		fishing: true,
	},
	{
		id: 'snail',
		name: {
			'en-US': 'Sea Snail',
			'pt-BR': 'Caracol do Mar',
			'es-ES': 'Caracol de Mar',
		},
		value: 40,
		rarity: 'Common',
		emoji: '🐌',
		fishing: true,
	},
	{
		id: 'sardine',
		name: {
			'en-US': 'Sardine',
			'pt-BR': 'Sardinha',
			'es-ES': 'Sardina',
		},
		value: 50,
		rarity: 'Common',
		emoji: '🐟',
		fishing: true,
	},
	{
		id: 'shrimp',
		name: {
			'en-US': 'Shrimp',
			'pt-BR': 'Camarão',
			'es-ES': 'Camarón',
		},
		value: 500,
		rarity: 'Uncommon',
		emoji: '🦐',
		fishing: true,
	},
	{
		id: 'fish',
		name: {
			'en-US': 'Trop Fish',
			'pt-BR': 'Peixe Tropical',
			'es-ES': 'Pez Tropical',
		},
		value: 400,
		rarity: 'Uncommon',
		emoji: '🐠',
		fishing: true,
	},
	{
		id: 'feathers',
		name: {
			'en-US': 'Feather',
			'pt-BR': 'Pena',
			'es-ES': 'Pluma',
		},
		value: 50,
		rarity: 'Uncommon',
		emoji: '🪶',
		hunting: true,
	},
	{
		id: 'chipmunk',
		name: {
			'en-US': 'Chipmunk Pelt',
			'pt-BR': 'Pele de Esquilo',
			'es-ES': 'Piel de Ardilla',
		},
		value: 100,
		rarity: 'Uncommon',
		emoji: '🐿️',
		hunting: true,
	},
	{
		id: 'chunk',
		name: {
			'en-US': 'Meat Chunk',
			'pt-BR': 'Carne',
			'es-ES': 'Carne',
		},
		value: 200,
		rarity: 'Common',
		emoji: '🍖',
		hunting: true,
	},
	{
		id: 'skunk',
		name: {
			'en-US': 'Skunk Pelt',
			'pt-BR': 'Pele de Gambá',
			'es-ES': 'Piel de Zorrillo',
		},
		value: 400,
		rarity: 'Uncommon',
		emoji: '🦨',
		hunting: true,
	},
	{
		id: 'steak',
		name: {
			'en-US': 'Raw Steak',
			'pt-BR': 'Bife Cru',
			'es-ES': 'Filete Crudo',
		},
		value: 1000,
		rarity: 'Rare',
		emoji: '🥩',
		hunting: true,
	},
	{
		id: 'coal',
		name: {
			'en-US': 'Coal',
			'pt-BR': 'Carvão',
			'es-ES': 'Carbón',
		},
		value: 50,
		rarity: 'Common',
		emoji: '⬛',
		mining: true,
	},
	{
		id: 'copper',
		name: {
			'en-US': 'Copper',
			'pt-BR': 'Cobre',
			'es-ES': 'Cobre',
		},
		value: 100,
		rarity: 'Common',
		emoji: '🪙',
		mining: true,
	},
	{
		id: 'aluminium',
		name: {
			'en-US': 'Aluminium',
			'pt-BR': 'Alumínio',
			'es-ES': 'Aluminio',
		},
		value: 200,
		rarity: 'Uncommon',
		emoji: '🔋',
		mining: true,
	},
	{
		id: 'iron',
		name: {
			'en-US': 'Iron',
			'pt-BR': 'Ferro',
			'es-ES': 'Hierro',
		},
		value: 300,
		rarity: 'Uncommon',
		emoji: '⛓️',
		mining: true,
	},
	{
		id: 'silver',
		name: {
			'en-US': 'Silver',
			'pt-BR': 'Prata',
			'es-ES': 'Plata',
		},
		value: 500,
		rarity: 'Rare',
		emoji: '🥈',
		mining: true,
	},
	{
		id: 'scrap',
		name: {
			'en-US': 'Scrap Metal',
			'pt-BR': 'Sucata',
			'es-ES': 'Chatarra',
		},
		value: 250,
		rarity: 'Uncommon',
		emoji: '⚙️',
		exploring: true,
	},
	{
		id: 'knife',
		name: {
			'en-US': 'Rusty Knife',
			'pt-BR': 'Faca Velha',
			'es-ES': 'Cuchillo Viejo',
		},
		value: 200,
		rarity: 'Rare',
		emoji: '🔪',
		exploring: true,
	},
	{
		id: 'ashes',
		name: {
			'en-US': 'Ashes',
			'pt-BR': 'Cinzas',
			'es-ES': 'Cenizas',
		},
		value: 100,
		rarity: 'Uncommon',
		emoji: '🚬',
		exploring: true,
	},
	{
		id: 'weeds',
		name: {
			'en-US': 'Weeds',
			'pt-BR': 'Ervas',
			'es-ES': 'Hierbas',
		},
		value: 50,
		rarity: 'Common',
		emoji: '🌿',
		exploring: true,
		growTime: 5400000,
		harvestAmount: {
			min: 5,
			max: 20,
		},
	},
	{
		id: 'rock',
		name: {
			'en-US': 'Rock',
			'pt-BR': 'Pedra',
			'es-ES': 'Piedra',
		},
		value: 50,
		rarity: 'Common',
		emoji: '🪨',
		exploring: true,
		mining: true,
	},
	{
		id: 'bricks',
		name: {
			'en-US': 'Bricks',
			'pt-BR': 'Tijolos',
			'es-ES': 'Ladrillos',
		},
		value: 4200,
		emoji: '🧱',
		recipe: {
			tools: 1,
			rock: 40,
		},
	},
	{
		id: 'beam',
		name: {
			'en-US': 'Steel Beam',
			'pt-BR': 'Viga de Aço',
			'es-ES': 'Viga de Acero',
		},
		value: 37500,
		emoji: '🏗️',
		recipe: {
			tools: 5,
			scrap: 40,
			iron: 50,
		},
	},
	{
		id: 'hall',
		name: {
			'en-US': 'Grand Hall',
			'pt-BR': 'Grande Salão',
			'es-ES': 'Gran Salón',
		},
		value: 250000,
		emoji: '🏛️',
		recipe: {
			tools: 8,
			bricks: 25,
			beam: 2,
		},
	},
	{
		id: 'rope',
		name: {
			'en-US': 'Knoted Rope',
			'pt-BR': 'Corda',
			'es-ES': 'Cuerda',
		},
		value: 2000,
		emoji: '🪢',
		recipe: {
			weeds: 20,
		},
	},
	{
		id: 'leather',
		name: {
			'en-US': 'Tough Leather',
			'pt-BR': 'Couro Duro',
			'es-ES': 'Cuero Duro',
		},
		value: 7500,
		rarity: 'Epic',
		emoji: '🐄',
		hunting: true,
	},
	{
		id: 'backpack',
		name: {
			'en-US': 'Big Backpack',
			'pt-BR': 'Mochila',
			'es-ES': 'Mochila',
		},
		value: 100000,
		emoji: '🎒',
		use: true,
		effect: 'inventory-buff',
		recipe: {
			leather: 8,
			rope: 10,
			chipmunk: 20,
		},
	},
	{
		id: 'gunpowder',
		name: {
			'en-US': 'Gunpowder',
			'pt-BR': 'Pólvora',
			'es-ES': 'Pólvora',
		},
		value: 2200,
		emoji: '🎇',
		recipe: {
			ashes: 20,
		},
	},
	{
		id: 'bomb',
		name: {
			'en-US': 'Bomb',
			'pt-BR': 'Bomba',
			'es-ES': 'Bomba',
		},
		value: 8200,
		emoji: '💣',
		recipe: {
			gunpowder: 2,
			scrap: 4,
			rope: 1,
		},
	},
	{
		id: 'ironpick',
		name: {
			'en-US': 'Iron Pickaxe',
			'pt-BR': 'Picareta de Ferro',
			'es-ES': 'Pico de Hierro',
		},
		value: 30000,
		equip: true,
		emoji: '⛏️',
		effect: 'mine-2',
		recipe: {
			log: 10,
			iron: 15,
			tools: 4,
			rope: 4,
		},
	},
	{
		id: 'diapick',
		name: {
			'en-US': 'Diamond Pickaxe',
			'pt-BR': 'Picareta de Diamante',
			'es-ES': 'Pico de Diamante',
		},
		value: 250000,
		equip: true,
		emoji: '⛏️',
		effect: 'mine-4',
		recipe: {
			ironpick: 1,
			diamond: 3,
			tools: 1,
		},
	},
	{
		id: 'rod',
		name: {
			'en-US': 'Fishing Rod',
			'pt-BR': 'Vara de Pesca',
			'es-ES': 'Caña de Pescar',
		},
		value: 30000,
		equip: true,
		emoji: '🎣',
		effect: 'fish-2',
		recipe: {
			log: 10,
			scrap: 8,
			tools: 5,
			rope: 5,
		},
	},
	{
		id: 'diarod',
		name: {
			'en-US': 'Diamond Rod',
			'pt-BR': 'Vara de Diamante',
			'es-ES': 'Caña de Diamante',
		},
		value: 250000,
		equip: true,
		emoji: '🎣',
		effect: 'fish-4',
		recipe: {
			rod: 1,
			diamond: 3,
			tools: 1,
		},
	},
	{
		id: 'plushtoy',
		name: {
			'en-US': 'Plush Toy',
			'pt-BR': 'Pelúcia',
			'es-ES': 'Peluche',
		},
		value: 24500,
		emoji: '🧸',
		recipe: {
			wool: 10,
			feathers: 150,
			leather: 1,
		},
	},
	{
		id: 'balltoy',
		name: {
			'en-US': 'Ball',
			'pt-BR': 'Bola',
			'es-ES': 'Pelota',
		},
		value: 22500,
		emoji: '🏐',
		recipe: {
			wool: 2,
			skunk: 10,
			leather: 2,
		},
	},
	{
		id: 'lightbulb',
		name: {
			'en-US': 'Lightbulb',
			'pt-BR': 'Lâmpada',
			'es-ES': 'Bombilla',
		},
		value: 1500,
		rarity: 'Rare',
		emoji: '💡',
		exploring: true,
	},
	{
		id: 'board',
		name: {
			'en-US': 'Circuit Board',
			'pt-BR': 'Circuito',
			'es-ES': 'Circuito',
		},
		value: 2000,
		rarity: 'Epic',
		emoji: '💾',
		exploring: true,
	},
	{
		id: 'sprinkler',
		name: {
			'en-US': 'Sprinkler',
			'pt-BR': 'Regador',
			'es-ES': 'Regador',
		},
		value: 40000,
		emoji: '⛲',
		recipe: {
			cpu: 1,
			board: 3,
			scrap: 6,
			tools: 2,
			supply: 1,
		},
	},
	{
		id: 'puzzletoy',
		name: {
			'en-US': 'Puzzle Toy',
			'pt-BR': 'Quebra-cabeça',
			'es-ES': 'Rompecabezas',
		},
		value: 37000,
		emoji: '🧩',
		recipe: {
			board: 10,
			scrap: 6,
			log: 40,
		},
	},
	{
		id: 'gold',
		name: {
			'en-US': 'Gold',
			'pt-BR': 'Ouro',
			'es-ES': 'Oro',
		},
		value: 800,
		rarity: 'Rare',
		emoji: '🥇',
		mining: true,
	},
	{
		id: 'cpu',
		name: {
			'en-US': 'CPU',
			'pt-BR': 'Processador',
			'es-ES': 'Procesador',
		},
		value: 23500,
		emoji: '🖥️',
		recipe: {
			board: 2,
			scrap: 2,
			copper: 2,
			gold: 1,
			silver: 1,
		},
	},
	{
		id: 'activewear',
		name: {
			'en-US': 'Activewear',
			'pt-BR': 'Roupa',
			'es-ES': 'Ropa',
		},
		value: 30000,
		equip: true,
		emoji: '🥋',
		effect: 'explore-2',
		recipe: {
			wool: 12,
			tools: 1,
			rope: 5,
		},
	},
	{
		id: 'ox',
		name: {
			'en-US': 'Ox Pelt',
			'pt-BR': 'Pele de Boi',
			'es-ES': 'Piel de Buey',
		},
		value: 10000,
		rarity: 'Epic',
		emoji: '🐂',
		hunting: true,
	},
	{
		id: 'buffalo',
		name: {
			'en-US': 'Buffalo Pelt',
			'pt-BR': 'Pele de Búfalo',
			'es-ES': 'Piel de Búfalo',
		},
		value: 20000,
		rarity: 'Legendary',
		emoji: '🐃',
		hunting: true,
	},
	{
		id: 'coat',
		name: {
			'en-US': 'Down Coat',
			'pt-BR': 'Casaco',
			'es-ES': 'Abrigo',
		},
		value: 250000,
		equip: true,
		emoji: '🧥',
		effect: 'explore-4',
		recipe: {
			activewear: 1,
			feathers: 50,
			chipmunk: 30,
			skunk: 15,
			ox: 17,
			buffalo: 1,
		},
	},
	{
		id: 'supply',
		name: {
			'en-US': 'Power Supply',
			'pt-BR': 'Fonte',
			'es-ES': 'Fuente',
		},
		value: 1700,
		emoji: '🔌',
		recipe: {
			aluminium: 5,
			copper: 5,
		},
	},
	{
		id: 'diamond',
		name: {
			'en-US': 'Diamond',
			'pt-BR': 'Diamante',
			'es-ES': 'Diamante',
		},
		value: 50000,
		rarity: 'Epic',
		emoji: '💎',
		mining: true,
	},
	{
		id: 'tractor',
		name: {
			'en-US': 'Tractor',
			'pt-BR': 'Trator',
			'es-ES': 'Tractor',
		},
		value: 45000,
		emoji: '🚜',
		recipe: {
			lightbulb: 8,
			board: 4,
			tools: 4,
			scrap: 25,
			supply: 1,
		},
	},
	{
		id: 'dagger',
		name: {
			'en-US': 'Dagger',
			'pt-BR': 'Adaga',
			'es-ES': 'Daga',
		},
		value: 8400,
		emoji: '🗡️',
		recipe: {
			knife: 20,
			tools: 2,
		},
	},
	{
		id: 'huntknife',
		name: {
			'en-US': 'Hunting Knife',
			'pt-BR': 'Faca de Caça',
			'es-ES': 'Cuchillo de Caza',
		},
		value: 30000,
		equip: true,
		emoji: '⚔️',
		effect: 'hunt-2',
		recipe: {
			dagger: 2,
			knife: 8,
			rope: 1,
			tools: 4,
		},
	},
	{
		id: 'shield',
		name: {
			'en-US': 'Diamond Shield',
			'pt-BR': 'Escudo de Diamante',
			'es-ES': 'Escudo de Diamante',
		},
		value: 300000,
		emoji: '🛡️',
		recipe: {
			diamond: 5,
			scrap: 20,
			log: 10,
			tools: 1,
		},
	},
	{
		id: 'diaknife',
		name: {
			'en-US': 'Diamond Handknife',
			'pt-BR': 'Faca de Diamante',
			'es-ES': 'Cuchillo de Diamante',
		},
		value: 250000,
		equip: true,
		emoji: '⚔️',
		effect: 'hunt-4',
		recipe: {
			huntknife: 1,
			diamond: 3,
			tools: 1,
		},
	},
	{
		id: 'milk',
		name: {
			'en-US': 'Milk',
			'pt-BR': 'Leite',
			'es-ES': 'Leche',
		},
		value: 400,
		rarity: 'Uncommon',
		emoji: '🥛',
		exploring: true,
	},
	{
		id: 'wheat',
		name: {
			'en-US': 'Wheat',
			'pt-BR': 'Trigo',
			'es-ES': 'Trigo',
		},
		value: 1000,
		rarity: 'Rare',
		emoji: '🌾',
		exploring: true,
		growTime: 9000000,
		harvestAmount: {
			min: 15,
			max: 40,
		},
	},
	{
		id: 'butter',
		name: {
			'en-US': 'Butter',
			'pt-BR': 'Manteiga',
			'es-ES': 'Mantequilla',
		},
		value: 1000,
		emoji: '🧈',
		recipe: {
			milk: 2,
		},
	},
	{
		id: 'waffle',
		name: {
			'en-US': 'Waffle',
			'pt-BR': 'Panqueca',
			'es-ES': 'Gofre',
		},
		value: 5500,
		emoji: '🧇',
		recipe: {
			butter: 1,
			wheat: 4,
		},
	},
	{
		id: 'cheese',
		name: {
			'en-US': 'Cheese',
			'pt-BR': 'Queijo',
			'es-ES': 'Queso',
		},
		value: 1800,
		emoji: '🧀',
		recipe: {
			milk: 4,
		},
	},
	{
		id: 'loaf',
		name: {
			'en-US': 'Bread',
			'pt-BR': 'Pão',
			'es-ES': 'Pan',
		},
		value: 5000,
		emoji: '🍞',
		recipe: {
			wheat: 5,
		},
	},
	{
		id: 'rice',
		name: {
			'en-US': 'White Rice',
			'pt-BR': 'Arroz',
			'es-ES': 'Arroz',
		},
		value: 1000,
		rarity: 'Epic',
		emoji: '🍚',
		exploring: true,
	},
	{
		id: 'sushi',
		name: {
			'en-US': 'Sushi',
			'pt-BR': 'Sushi',
			'es-ES': 'Sushi',
		},
		value: 3000,
		emoji: '🍣',
		recipe: {
			fish: 4,
			rice: 1,
		},
	},
	{
		id: 'hamburger',
		name: {
			'en-US': 'Hamburger',
			'pt-BR': 'Hambúrguer',
			'es-ES': 'Hamburguesa',
		},
		value: 14500,
		emoji: '🍔',
		recipe: {
			steak: 1,
			loaf: 2,
			cheese: 1,
		},
	},
	{
		id: 'fertilizer',
		name: {
			'en-US': 'Fertilizer',
			'pt-BR': 'Fertilizante',
			'es-ES': 'Fertilizante',
		},
		value: 12500,
		emoji: '💩',
		use: true,
		effect: 'grow-2',
		recipe: {
			weeds: 150,
		},
	},
	{
		id: 'oil',
		name: {
			'en-US': 'Petroleum',
			'pt-BR': 'Petróleo',
			'es-ES': 'Petróleo',
		},
		value: 2000,
		rarity: 'Epic',
		emoji: '🛢️',
		mining: true,
	},
	{
		id: 'crab',
		name: {
			'en-US': 'Crab',
			'pt-BR': 'Siri',
			'es-ES': 'Cangrejo',
		},
		value: 400,
		rarity: 'Uncommon',
		emoji: '🦀',
		fishing: true,
	},
	{
		id: 'artifact',
		name: {
			'en-US': 'Artifact',
			'pt-BR': 'Artefato',
			'es-ES': 'Artefacto',
		},
		value: 10000,
		rarity: 'Epic',
		emoji: '🏺',
		exploring: true,
	},
	{
		id: 'fossil',
		name: {
			'en-US': 'Ancient Fossil',
			'pt-BR': 'Fóssil',
			'es-ES': 'Fósil',
		},
		value: 15000,
		rarity: 'Legendary',
		emoji: '🐊',
		mining: true,
	},
	{
		id: 'treasure',
		name: {
			'en-US': 'Ancient Treasure',
			'pt-BR': 'Tesouro Antigo',
			'es-ES': 'Tesoro Antiguo',
		},
		value: 150000,
		rarity: 'Legendary',
		emoji: '👑',
		mining: true,
	},
	{
		id: 'manuscript',
		name: {
			'en-US': 'Sacred Manuscript',
			'pt-BR': 'Manuscrito Sagrado',
			'es-ES': 'Manuscrito Sagrado',
		},
		value: 300000,
		rarity: 'Legendary',
		emoji: '📜',
		exploring: true,
	},
	{
		id: 'oyster',
		name: {
			'en-US': 'Oyster',
			'pt-BR': 'Ostra',
			'es-ES': 'Ostra',
		},
		value: 950,
		rarity: 'Rare',
		emoji: '🦪',
		fishing: true,
	},
	{
		id: 'squid',
		name: {
			'en-US': 'Squid',
			'pt-BR': 'Lula',
			'es-ES': 'Calamar',
		},
		value: 1500,
		rarity: 'Epic',
		emoji: '🦑',
		fishing: true,
	},
	{
		id: 'blowfish',
		name: {
			'en-US': 'Blowfish',
			'pt-BR': 'Baiacu',
			'es-ES': 'Pez Globo',
		},
		value: 5000,
		rarity: 'Legendary',
		emoji: '🐡',
		fishing: true,
	},
	{
		id: 'lobster',
		name: {
			'en-US': 'Lobster',
			'pt-BR': 'Lagosta',
			'es-ES': 'Langosta',
		},
		value: 750,
		rarity: 'Rare',
		emoji: '🦞',
		fishing: true,
	},
	{
		id: 'shark',
		name: {
			'en-US': 'Shark',
			'pt-BR': 'Tubarão',
			'es-ES': 'Tiburón',
		},
		value: 80000,
		rarity: 'Legendary',
		emoji: '🦈',
		fishing: true,
	},
	{
		id: 'octopus',
		name: {
			'en-US': 'Octopus',
			'pt-BR': 'Polvo',
			'es-ES': 'Pulpo',
		},
		value: 400000,
		rarity: 'Legendary',
		emoji: '🐙',
		fishing: true,
	},
	{
		id: 'thigh',
		name: {
			'en-US': 'Thigh',
			'pt-BR': 'Coxa',
			'es-ES': 'Muslo',
		},
		value: 500,
		rarity: 'Uncommon',
		emoji: '🍗',
		hunting: true,
	},
	{
		id: 'turkey',
		name: {
			'en-US': 'Turkey',
			'pt-BR': 'Peru',
			'es-ES': 'Pavo',
		},
		value: 300,
		rarity: 'Uncommon',
		emoji: '🦃',
		hunting: true,
	},
	{
		id: 'fishwich',
		name: {
			'en-US': 'Fishwich',
			'pt-BR': 'Peixeguer',
			'es-ES': 'Pescado',
		},
		value: 13500,
		emoji: '🍔',
		recipe: {
			fish: 1,
			loaf: 2,
			cheese: 1,
		},
	},
	{
		id: 'clover',
		name: {
			'en-US': 'Clover',
			'pt-BR': 'Trevo',
			'es-ES': 'Trébol',
		},
		value: 400,
		rarity: 'Epic',
		emoji: '🍀',
		exploring: true,
		growTime: 21600000,
		harvestAmount: {
			min: 10,
			max: 100,
		},
	},
	{
		id: 'snowflake',
		name: {
			'en-US': 'Eternal Snowflake',
			'pt-BR': 'Floco eterno',
			'es-ES': 'Copo eterno',
		},
		emoji: '❄️',
		use: true,
		mythical: true,
		effect: 'reset-cooldowns',
		recipe: {
			manuscript: 1,
			fossil: 5,
			artifact: 10,
		},
	},
	{
		id: 'coffeebean',
		name: {
			'pt-BR': 'Grão de Café',
			'en-US': 'Coffee Bean',
			'es-ES': 'Grano de Café',
		},
		value: 150,
		rarity: 'Uncommon',
		emoji: '🫘',
		exploring: true,
		growTime: 10800000,
		harvestAmount: {
			min: 50,
			max: 100,
		},
	},
	{
		id: 'coffe',
		name: {
			'pt-BR': 'Café',
			'en-US': 'Coffee',
			'es-ES': 'Café',
		},
		value: 6500,
		emoji: '☕',
		equip: true,
		effect: 'work-2',
		recipe: {
			coffeebean: 40,
		},
	},
	{
		id: 'blueberry',
		name: {
			'en-US': 'Blueberry',
			'pt-BR': 'Mirtilo',
			'es-ES': 'Arándano',
		},
		value: 75,
		rarity: 'Common',
		emoji: '🫐',
		growTime: 3000000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'strawberry',
		name: {
			'en-US': 'Strawberry',
			'pt-BR': 'Morango',
			'es-ES': 'Fresa',
		},
		value: 135,
		rarity: 'Common',
		emoji: '🍓',
		growTime: 3600000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'kiwi',
		name: {
			'en-US': 'Kiwi',
			'pt-BR': 'Kiwi',
			'es-ES': 'Kiwi',
		},
		value: 375,
		rarity: 'Uncommon',
		emoji: '🥝',
		growTime: 5400000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'mango',
		name: {
			'en-US': 'Mango',
			'pt-BR': 'Manga',
			'es-ES': 'Mango',
		},
		value: 800,
		rarity: 'Uncommon',
		emoji: '🥭',
		growTime: 7200000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'melon',
		name: {
			'en-US': 'Melon',
			'pt-BR': 'Melão',
			'es-ES': 'Melón',
		},
		value: 3000,
		rarity: 'Uncommon',
		emoji: '🍈',
		growTime: 14400000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'coconut',
		name: {
			'en-US': 'Coconut',
			'pt-BR': 'Coco',
			'es-ES': 'Coco',
		},
		value: 6000,
		rarity: 'Epic',
		emoji: '🥥',
		growTime: 28800000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'pumpkin',
		name: {
			'en-US': 'Pumpkin',
			'pt-BR': 'Abóbora',
			'es-ES': 'Calabaza',
		},
		value: 17000,
		rarity: 'Epic',
		emoji: '🎃',
		growTime: 86400000,
		harvestAmount: {
			min: 5,
			max: 10,
		},
	},
	{
		id: 'potato',
		name: {
			'en-US': 'Potato',
			'pt-BR': 'Batata',
			'es-ES': 'Patata',
		},
		value: 1000,
		rarity: 'Uncommon',
		emoji: '🥔',
		growTime: 259200000,
		harvestAmount: {
			min: 100,
			max: 200,
		},
	},
];

class Item {
	_items = new Map(items.map((a) => [a.id, a]));
	exploringItems = new Map(items.filter((a) => a.exploring).map((a) => [a.id, a]));
	miningItems = new Map(items.filter((a) => a.mining).map((a) => [a.id, a]));
	fishingItems = new Map(items.filter((a) => a.fishing).map((a) => [a.id, a]));
	huntingItems = new Map(items.filter((a) => a.hunting).map((a) => [a.id, a]));

	constructor() {
		this._items = new Map(items.map((a) => [a.id, a]));
	}

	all() {
		return this._items;
	}

	getById(id) {
		return this._items.get(id) ?? undefined;
	}

	getByName(name) {
		return (
			Array.from(this._items.values()).find((a) =>
				Object.values(a.name).some((n) => n.toLowerCase() === name.toLowerCase())
			) ?? null
		);
	}

	getItem(item) {
		if (!'abcdefghijklmnopqrstuvwxyz'.includes(item[0].toLowerCase())) {
			item = item.split(' ').slice(1).join(' ');
		}

		item = item.toLowerCase();

		return this.getByName(item) ?? this.getById(item);
	}
}

module.exports = new Item();
