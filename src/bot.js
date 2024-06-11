const { randint, format } = require('./utils/functions.js');
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config();
const { loadEvents } = require('./handlers/eventHandler.js');
const { loadCommands } = require('./handlers/commandHandler.js');

class Falbot {
	config = require('./config.json');
	_messages = require(path.join(__dirname, '/utils/json/messages.json'));
	_banned = new Array();
	database = require('./handlers/databaseHandler.js');
	emojiList = {};
	client = new Client({
		shards: 'auto',
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
	});
	levels = require('./utils/json/levels.json');
	items = require('./utils/json/items.json');
	userSchema = require('./schemas/user-schema.js');
	lottoSchema = require('./schemas/lotto-schema.js');
	interestSchema = require('./schemas/interest-schema.js');
	bannedSchema = require('./schemas/banned-schema.js');
	activeEvents = new Map();

	constructor() {
		this.client.on('ready', () => {
			console.log('Bot online');

			this.client.events = new Collection();
			this.client.commands = new Collection();

			loadEvents(this, this.client);
			loadCommands(this, this.client);

			try {
				this.config.testGuilds.forEach(async (guild) => {
					guild = this.client.guilds.cache.get(guild);
					for (const [key, value] of await guild.emojis.fetch()) {
						this.emojiList[value.name] = value;
					}
				});
			} catch {
				console.error('Bot private emojis not found, some commands may not work.');
			}
		});

		this.client.login(process.env.TOKEN);
		(async () => {
			const banned = await this.bannedSchema.find();

			for (const result of banned) {
				this._banned.push(result.id);
			}
		})();

		setInterval(
			() => {
				this.client.user.setActivity('/help | arte by: @kinsallum'), this.bankInterest(), this.lotteryDraw();
			},
			1000 * 60 * 5
		);

		setInterval(
			() => {
				this.randomEventsHandler();
			},
			1000 * 60 * 45
		);
	}

	async bankInterest() {
		const interest = await this.interestSchema.findById('interest');
		if (Date.now() - interest.lastInterest > 1000 * 60 * 60 * 24) {
			console.log('interest!');
			interest.lastInterest = Date.now().toString();

			var users = await this.userSchema.find({
				bank: { $gt: 0 },
			});

			for (const user of users) {
				var limit = this.levels[user.rank - 1].bankLimit;

				if (limit > user.bank) {
					user.bank += Math.floor(parseInt(user.bank * 0.1));
				}

				if (user.bank > limit) {
					user.bank = limit;
				}

				user.save();
			}
			interest.save();
		}
	}

	async lotteryDraw() {
		const lotto = await this.lottoSchema.findById('weekly');

		if (Date.now() > lotto.nextDraw) {
			console.log('lottery!');

			const users = await this.userSchema.find({
				tickets: { $gt: 0 },
			});

			if (users.length > 0) {
				const numTickets = users.reduce((acc, user) => acc + user.tickets, 0);

				var winner;
				while (winner === undefined) {
					for (const user of users) {
						if (randint(1, numTickets) <= user.tickets) {
							winner = user;
						}
					}
				}

				const winnerFile = await this.database.player.findOne(winner.id);
				winnerFile.falcoins += lotto.prize;
				winnerFile.stats.lotteryWins += lotto.prize;
				winnerFile.save();

				var winnerUser = await this.client.users.fetch(winner.id);

				const embed = new EmbedBuilder()
					.setColor(15844367)
					.addFields({
						name: await this.getDmMessage(winnerUser, 'CONGRATULATIONS'),
						value: await this.getDmMessage(winnerUser, 'LOTTERY_WIN', {
							PRIZE: format(lotto.prize),
							TICKETS: format(winner.tickets),
							TOTAL: format(numTickets),
						}),
					})
					.setFooter({ text: 'by Falcão ❤️' });

				await this.userSchema.updateMany(
					{
						tickets: { $gt: 0 },
					},
					{
						tickets: 0,
					}
				);

				await winnerUser.send({
					embeds: [embed],
				});

				lotto.history.unshift({
					prize: lotto.prize,
					winner: winnerUser.username,
					userTickets: winner.tickets,
					totalTickets: numTickets,
				});
				lotto.prize = randint(3500000, 5000000);
			} else {
				lotto.history.unshift({
					prize: lotto.prize,
				});
				lotto.prize = lotto.prize + randint(3500000, 5000000);
			}

			if (lotto.history.length >= 10) lotto.history.pop();
			lotto.nextDraw = Date.now() + 604800000; //next one is next week
			await lotto.save();
		}
	}

	async randomEventsHandler() {
		const events = [
			{
				probability: 0.05,
				name: 'Overtime',
				min_time: 60,
				max_time: 120,
			},
			{
				probability: 0.03,
				name: 'Search Party',
				min_time: 60,
				max_time: 120,
			},
			{
				probability: 0.03,
				name: 'Stampede',
				min_time: 60,
				max_time: 120,
			},
			{
				probability: 0.03,
				name: 'Flood',
				min_time: 60,
				max_time: 120,
			},
			{
				probability: 0.03,
				name: 'Comet',
				min_time: 60,
				max_time: 120,
			},
		];

		for (const event of events) {
			const randomProbability = Math.random();
			if (randomProbability <= event.probability) {
				if (!this.activeEvents.has(event.name)) {
					var duration = 1000 * 60 * randint(event.min_time, event.max_time);
					this.activeEvents.set(event.name, Date.now() + duration);
					setTimeout(() => {
						this.activeEvents.delete(event.name);
					}, duration);
					break;
				}
			}
		}
	}

	ban(userId) {
		this._banned.push(userId);
	}

	unban(userId) {
		this._banned = this._banned.filter((id) => id != userId);
	}

	defaultFilter(interaction) {
		return !interaction.user.bot && !this._banned.includes(interaction.user.id);
	}

	getMessage(interaction, messageId, args = {}) {
		const message = this._messages[messageId];
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`);
			return 'Could not find the correct message to send. Please report this to the bot developer.';
		}

		var locale = interaction.locale ?? 'pt-BR';
		var result = message[locale] ?? message['en-US'];

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, 'g');
			result = result.replace(expression, args[key]);
		}

		this.userSchema.findByIdAndUpdate(interaction.user.id, { locale: locale }).then(() => {});
		return result;
	}

	async getDmMessage(user, messageId, args = {}) {
		const message = this._messages[messageId];
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`);
			return 'Could not find the correct message to send. Please report this to the bot developer.';
		}

		var userFile = await this.userSchema.findById(user.id);
		var locale = userFile.locale ?? 'en-US';
		var result = message[locale] ?? message['en-US'];

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, 'g');
			result = result.replace(expression, args[key]);
		}

		return result;
	}

	async rankPerks(old_rank, rank, interaction) {
		var perks = '';
		if (old_rank != undefined) {
			if (old_rank.bankLimit < rank.bankLimit) {
				perks += this.getMessage(interaction, 'RANKUP_BANK', {
					FALCOINS: format(rank.bankLimit - old_rank.bankLimit),
				});
				perks += '\n';
			}

			if (old_rank.inventoryLimit < rank.inventoryLimit) {
				perks += this.getMessage(interaction, 'RANKUP_INVENTORY', {
					FALCOINS: format(rank.inventoryLimit - old_rank.inventoryLimit),
				});
				perks += '\n';
			}

			if (old_rank.farmPlots < rank.farmPlots) {
				perks += this.getMessage(interaction, 'RANKUP_FARM', {
					PLOTS: format(rank.farmPlots - old_rank.farmPlots),
				});
				perks += '\n';
			}
		}

		perks += `${this.getMessage(interaction, 'VOTE')}: ${format(rank.vote)} Falcoins\n`;

		perks += `${this.getMessage(interaction, 'WORK')}: ${format(rank.work[0])}-${format(rank.work[1])} Falcoins`;

		return perks;
	}

	getInventoryInfo(inventory) {
		return Array.from(inventory).reduce(
			(acc, [itemName, quantity]) => {
				if (this.items[itemName]['value'] !== undefined) acc.inventoryWorth += this.items[itemName]['value'] * quantity;
				acc.inventoryQuantity += quantity;
				return acc;
			},
			{ inventoryWorth: 0, inventoryQuantity: 0 }
		);
	}

	createEmbed(color = 'Random') {
		return new EmbedBuilder().setColor(color).setFooter({ text: 'by Falcão ❤️' });
	}

	getItemEmoji(item) {
		if (this.items[item].emoji) return this.items[item].emoji;
		return this.emojiList[item];
	}

	getItemName(item, interaction) {
		return `${this.getItemEmoji(item)} ${this.items[item][interaction.locale] ?? this.items[item]['en-US']}`;
	}

	async editReply(interaction, { content, embeds, components, fetchReply = false }) {
		return await interaction.editReply({ content, embeds, components, fetchReply }).catch((err) => {
			console.error(err);
		});
	}
}

Falbot = new Falbot();
