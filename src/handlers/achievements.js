const { format } = require('../utils/functions.js');
const database = require('../database/player.js');
const User = require('../schemas/user-schema.js');

const achievements = [
	{
		id: 'touch_grass',
		name: {
			'pt-BR': 'Vá tocar grama',
			'en-US': 'Go touch some grass',
			'es-ES': 'Ve a tocar hierba',
		},
		description: {
			'pt-BR': 'Use 1.000 comandos.',
			'en-US': 'Execute 1,000 commands.',
			'es-ES': 'Ejecuta 1.000 comandos.',
		},
		emoji: ':camping:',
		hasAchieved: (user) => user.stats.commands >= 1_000,
		progress: (user) => `${format(user.stats.commands ?? 0)}/1.000`,
	},
	{
		id: 'no_life',
		name: {
			'pt-BR': 'Sem vida',
			'en-US': 'No life',
			'es-ES': 'Sin vida',
		},
		description: {
			'pt-BR': 'Use 10.000 comandos.',
			'en-US': 'Execute 10,000 commands.',
			'es-ES': 'Ejecuta 10.000 comandos.',
		},
		emoji: ':video_game:',
		hasAchieved: (user) => user.stats.commands >= 10_000,
		progress: (user) => `${format(user.stats.commands ?? 0)}/10.000`,
	},
	{
		id: 'small_collection',
		name: {
			'pt-BR': 'Pequena coleção',
			'en-US': 'Small collection',
			'es-ES': 'Pequeña colección',
		},
		description: {
			'pt-BR': 'Encontre 20.000 itens.',
			'en-US': 'Find 20,000 items.',
			'es-ES': 'Encuentra 20.000 items.',
		},
		emoji: ':file_cabinet:',
		hasAchieved: (user) => user.stats.itemsFound >= 20_000,
		progress: (user) => `${format(user.stats.itemsFound ?? 0)}/20.000`,
	},
	{
		id: 'hard_work',
		name: {
			'pt-BR': 'Estagiário',
			'en-US': 'Intern',
			'es-ES': 'Becario',
		},
		description: {
			'pt-BR': 'Trabalhe 150 vezes.',
			'en-US': 'Work 150 times.',
			'es-ES': 'Trabaja 150 veces.',
		},
		emoji: ':office_worker:',
		hasAchieved: (user) => user.stats.timesWorked >= 150,
		progress: (user) => `${format(user.stats.timesWorked ?? 0)}/150`,
	},
	{
		id: 'novice_explorer',
		name: {
			'pt-BR': 'Explorador novato',
			'en-US': 'Novice explorer',
			'es-ES': 'Explorador novato',
		},
		description: {
			'pt-BR': 'Explore 100 vezes.',
			'en-US': 'Explore 100 times.',
			'es-ES': 'Explora 100 veces.',
		},
		emoji: ':person_climbing:',
		hasAchieved: (user) => user.stats.timesExplored >= 100,
		progress: (user) => `${format(user.stats.timesExplored ?? 0)}/100`,
	},
	{
		id: 'fish_dealer',
		name: {
			'pt-BR': 'Vendedor de peixes',
			'en-US': 'Fish dealer',
			'es-ES': 'Vendedor de pescado',
		},
		description: {
			'pt-BR': 'Pesque 100 vezes.',
			'en-US': 'Fish 100 times.',
			'es-ES': 'Pesca 100 veces.',
		},
		emoji: ':island:',
		hasAchieved: (user) => user.stats.timesFished >= 100,
		progress: (user) => `${format(user.stats.timesFished ?? 0)}/100`,
	},
	{
		id: 'animal_hunter',
		name: {
			'pt-BR': 'Caçador de animais',
			'en-US': 'Animal hunter',
			'es-ES': 'Cazador de animales',
		},
		description: {
			'pt-BR': 'Cace 100 vezes.',
			'en-US': 'Hunt 100 times.',
			'es-ES': 'Caza 100 veces.',
		},
		emoji: ':duck:',
		hasAchieved: (user) => user.stats.timesHunted >= 100,
		progress: (user) => `${format(user.stats.timesHunted ?? 0)}/100`,
	},
	{
		id: 'rock_and_stone',
		name: {
			'pt-BR': 'Rock and Stone!',
			'en-US': 'Rock and Stone!',
			'es-ES': 'Rock and Stone!',
		},
		description: {
			'pt-BR': 'Minere 100 vezes.',
			'en-US': 'Mine 100 times.',
			'es-ES': 'Mina 100 veces.',
		},
		emoji: ':rock:',
		hasAchieved: (user) => user.stats.timesMined >= 100,
		progress: (user) => `${format(user.stats.timesMined ?? 0)}/100`,
	},
	{
		id: 'thank_you',
		name: {
			'pt-BR': 'Obrigado!',
			'en-US': 'Thank you!',
			'es-ES': '¡Gracias!',
		},
		description: {
			'pt-BR': 'Vote 100 vezes.',
			'en-US': 'Vote 100 times.',
			'es-ES': 'Vota 100 veces.',
		},
		emoji: ':purple_heart:',
		hasAchieved: (user) => user.stats.timesVoted >= 100,
		progress: (user) => `${format(user.stats.timesVoted ?? 0)}/100`,
	},
	{
		id: 'crafter',
		name: {
			'pt-BR': 'Artesão',
			'en-US': 'Crafter',
			'es-ES': 'Artesano',
		},
		description: {
			'pt-BR': 'Construa 500 itens.',
			'en-US': 'Craft 500 items.',
			'es-ES': 'Construye 500 items.',
		},
		emoji: ':carpentry_saw:',
		hasAchieved: (user) => user.stats.itemsCrafted >= 500,
		progress: (user) => `${format(user.stats.itemsCrafted ?? 0)}/500`,
	},
	{
		id: 'one_in_a_million',
		name: {
			'pt-BR': 'Um em um milhão',
			'en-US': 'One in a million',
			'es-ES': 'Uno en un millón',
		},
		description: {
			'pt-BR': 'Ganhe na loteria.',
			'en-US': 'Win the lottery.',
			'es-ES': 'Gana la lotería.',
		},
		emoji: ':partying_face:',
		hasAchieved: (user) => user.stats.lotteryWins >= 1,
		progress: (user) => false,
	},
	{
		id: 'jackpot',
		name: {
			'pt-BR': 'Jackpot',
			'en-US': 'Jackpot',
			'es-ES': 'Jackpot',
		},
		description: {
			'pt-BR': 'Ganhe na raspadinha.',
			'en-US': 'Win the scratch card.',
			'es-ES': 'Gana en la raspadita.',
		},
		emoji: ':slot_machine:',
		hasAchieved: (user) => user.stats.scratchJackpots >= 1,
		progress: (user) => `${format(user.stats.scratchJackpots ?? 0)}/1`,
	},
	{
		id: 'farmer',
		name: {
			'pt-BR': 'Agricultor',
			'en-US': 'Farmer',
			'es-ES': 'Agricultor',
		},
		description: {
			'pt-BR': 'Regue sua plantação 50 vezes.',
			'en-US': 'Water your crops 50 times.',
			'es-ES': 'Riega tus cultivos 50 veces.',
		},
		emoji: ':farmer:',
		hasAchieved: (user) => user.stats.timesWatered >= 50,
		progress: (user) => `${format(user.stats.timesWatered ?? 0)}/50`,
	},
	{
		id: 'good_harvest',
		name: {
			'pt-BR': 'Boa colheita',
			'en-US': 'Good harvest',
			'es-ES': 'Buena cosecha',
		},
		description: {
			'pt-BR': 'Colha 3.000 culturas.',
			'en-US': 'Harvest 3,000 crops.',
			'es-ES': 'Cosecha 3.000 cultivos.',
		},
		emoji: ':sunrise_over_mountains:',
		hasAchieved: (user) => user.stats.cropsHarvested >= 3_000,
		progress: (user) => `${format(user.stats.cropsHarvested ?? 0)}/3.000`,
	},
	{
		id: 'seller',
		name: {
			'pt-BR': 'Vendedor',
			'en-US': 'Seller',
			'es-ES': 'Vendedor',
		},
		description: {
			'pt-BR': 'Venda 60 itens no mercado.',
			'en-US': 'Sell 60 items on the market.',
			'es-ES': 'Vende 60 items en el mercado.',
		},
		emoji: ':package:',
		hasAchieved: (user) => user.stats.listingsSold >= 60,
		progress: (user) => `${format(user.stats.listingsSold ?? 0)}/60`,
	},
	{
		id: 'mythical_time',
		name: {
			'pt-BR': 'Hora mítica',
			'en-US': 'Mythical time',
			'es-ES': 'Tiempo mítico',
		},
		description: {
			'pt-BR': 'Use 3 itens míticos.',
			'en-US': 'Use 3 mythical items.',
			'es-ES': 'Usa 3 items míticos.',
		},
		emoji: ':yin_yang:',
		hasAchieved: (user) => user.stats.mythicalUsed >= 3,
		progress: (user) => `${format(user.stats.mythicalUsed ?? 0)}/3`,
	},
];

class Achievement {
	_achievements = new Map(achievements.map((a) => [a.id, a]));

	constructor() {
		this._achievements = new Map(achievements.map((a) => [a.id, a]));
	}

	all() {
		return this._achievements;
	}

	getById(id) {
		return this._achievements.get(id) ?? null;
	}

	getByName(name) {
		return Array.from(this._achievements.values()).find((a) => a.name.toLowerCase() === name.toLowerCase()) ?? null;
	}

	hasAchievement(id, user) {
		return this._achievements.get(id)?.hasAchieved(user) ?? false;
	}

	getProgress(id, user) {
		return this._achievements.get(id)?.progress(user) ?? '';
	}

	async sendAchievementMessage(interaction, userId, achievement) {
		if (!achievement) return;

		const user = await database.findOne(userId);
		if (user.badges.includes(achievement.id)) return;
		if (!this.hasAchievement(achievement.id, user)) return;

		await User.findByIdAndUpdate(userId, { $push: { badges: achievement.id } });

		const responses = {
			'pt-BR': `:tada: ${interaction.member} você desbloqueou a conquista ${achievement.emoji} **${achievement.name[interaction.locale]}**!`,
			'en-US': `:tada: ${interaction.member} you've unlocked the ${achievement.emoji} **${achievement.name[interaction.locale]}** achievement!`,
			'es-ES': `:tada: ¡${interaction.member} has desbloqueado el logro ${achievement.emoji} **${achievement.name[interaction.locale]}**!`,
		};

		await interaction.channel.send({
			content: responses[interaction.locale],
		});
	}
}

module.exports = new Achievement();
