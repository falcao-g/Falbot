const userSchema = require('../schemas/user.js');
const { ActionRowBuilder, ButtonBuilder, GuildMember } = require('discord.js');

/**
 * @param {integer} ms
 * @description Converts milliseconds to a string with the format "1m 1d 1h 1m 1s"
 * @example msToTime(1000) // 1s
 * @returns {string}
 */
function msToTime(ms) {
	let time = '';

	let n = 0;
	if (ms >= 2592000000) {
		n = Math.floor(ms / 2592000000);
		time += `${n}m `;
		ms -= n * 2592000000;
	}

	if (ms >= 86400000) {
		n = Math.floor(ms / 86400000);
		time += `${n}d `;
		ms -= n * 86400000;
	}

	if (ms >= 3600000) {
		n = Math.floor(ms / 3600000);
		time += `${n}h `;
		ms -= n * 3600000;
	}

	if (ms >= 60000) {
		n = Math.floor(ms / 60000);
		time += `${n}m `;
		ms -= n * 60000;
	}

	if (time === '') time += '1m';

	return time.trimEnd();
}

/**
 *
 * @param {integer} falcoins
 * @description Format a number to a string with the format "1.000.000"
 * @example format(1000000) // 1.000.000
 * @returns {string}
 */
function format(falcoins) {
	if (falcoins < 0) {
		falcoins = Math.abs(falcoins);
	}

	return falcoins.toLocaleString('pt-BR');
}

/**
 *
 * @param {integer} low
 * @param {integer} high
 * @description Generates a random integer between low and high
 * @example randint(1, 10) // 5
 * @returns {integer}
 */
function randint(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

/**
 * @description Creates a pagination system
 */
function paginate() {
	const __embeds = [];
	const __components = [];
	let cur = 0;
	let traverser;
	return {
		add(...embeds) {
			__embeds.push(...embeds);
			return this;
		},
		addComponents(...components) {
			__components.push(...components);
			return this;
		},
		setTraverser(tr) {
			traverser = tr;
		},
		async next() {
			cur++;
			if (cur >= __embeds.length) {
				cur = 0;
			}
		},
		async back() {
			cur--;
			if (cur <= -__embeds.length) {
				cur = 0;
			}
		},
		components() {
			if (__components.length == 0) {
				return {
					embeds: [__embeds.at(cur)],
					components: [new ActionRowBuilder().addComponents(...traverser)],
					fetchReply: true,
				};
			}

			return {
				embeds: [__embeds.at(cur)],
				components: [
					new ActionRowBuilder().addComponents(__components.at(cur)),
					new ActionRowBuilder().addComponents(...traverser),
				],
				fetchReply: true,
			};
		},
	};
}

/**
 *
 * @param {Array<string, number>} data
 * @description Picks a random element from an array based on its weight, you can also alter the luck
 * @example pick([['a', 0.5], ['b', 0.3], ['c', 0.2]], 1) // 'a'
 * @returns {string}
 */
function pick(data, luck = 1) {
	// Split input into two separate arrays of values and weights.
	const values = data.map((d) => d[0]);
	const weights = data.map((d) => d[1]);

	let acc = 0;
	const sum = weights.reduce((acc, element) => acc + element, 0);
	const weightsSum = weights.map((element) => {
		acc = element + acc;
		return acc;
	});
	const rand = Math.random() * sum * luck;
	let index = weightsSum.filter((element) => element <= rand).length;
	index = index >= weights.length ? weights.length - 1 : index;
	return values[index];
}

/**
 *
 * @param {DiscordID} id
 * @param {string} command
 * @param {integer} cooldown
 * @description Sets a cooldown for a command
 * @async
 * @example setCooldown(id, 'explore', 60) // Sets a 60s cooldown for the explore command
 * @returns {Promise<void>}
 */
async function setCooldown(id, command, cooldown) {
	var { cooldowns } = await userSchema.findById(id);
	cooldowns.set(command, Date.now() + cooldown * 1000);
	await userSchema.findByIdAndUpdate(id, { cooldowns: cooldowns });
}

/**
 *
 * @param {DiscordID} id
 * @param {string} command
 * @description Resolves a cooldown for a command
 * @async
 * @example resolveCooldown(id, 'explore') // Returns 0 if the cooldown is over, or the remaining time if it isn't
 * @returns {integer}
 */
async function resolveCooldown(id, command) {
	var { cooldowns } = await userSchema.findById(id);
	var commandField = cooldowns.get(command);
	if (commandField != undefined) {
		if (commandField > Date.now()) {
			return commandField - Date.now();
		} else {
			cooldowns.set(command, 0);
			await userSchema.findByIdAndUpdate(id, { cooldowns: cooldowns });
		}
	}
	return 0;
}

/**
 *
 * @param {Array<string>} buttons
 * @description Returns a row of buttons
 * @example buttons(['cooldowns', 'help', 'balance'])
 * @returns {ActionRowBuilder}
 */
function buttons(buttons) {
	const row = new ActionRowBuilder();

	const buttonsEnum = {
		cooldowns: new ButtonBuilder().setCustomId('cooldowns').setEmoji('⏱️').setStyle('Secondary'),
		help: new ButtonBuilder().setCustomId('help').setEmoji('📚').setStyle('Secondary'),
		accept: new ButtonBuilder().setCustomId('accept').setEmoji('✅').setStyle('Success'),
		skip: new ButtonBuilder().setCustomId('skip').setEmoji('▶️').setStyle('Secondary'),
		refuse: new ButtonBuilder().setCustomId('refuse').setEmoji('⛔').setStyle('Danger'),
		inventory_view: new ButtonBuilder().setCustomId('inventory view').setEmoji('🎒').setStyle('Secondary'),
		balance: new ButtonBuilder().setCustomId('balance').setEmoji('🪙').setStyle('Secondary'),
		list_achievements: new ButtonBuilder().setCustomId('achievements list').setEmoji('🏆').setStyle('Secondary'),
	};

	for (button of buttons) {
		row.addComponents([buttonsEnum[button]]);
	}

	return row;
}

/**
 *
 * @param {GuildMember} member
 * @param {string} item
 * @description Checks if an item is equipped
 * @async
 * @example isEquipped(member, 'rod') // true
 * @returns {boolean}
 */
async function isEquipped(member, item) {
	const { equippedItems } = await userSchema.findById(member.id);

	for (itemEquipped of equippedItems) {
		if (itemEquipped.name === item) {
			return true;
		}
	}
}

/**
 *
 * @param {GuildMember} member
 * @param {string} item
 * @description Uses an item
 * @async
 * @example useItem(member, 'rod') // Decreases the rod's usage count by 1
 * @returns {Promise<void>}
 */
async function useItem(member, item) {
	var { equippedItems } = await userSchema.findById(member.id);

	for (itemEquipped of equippedItems) {
		if (itemEquipped.name === item) {
			itemEquipped.usageCount -= 1;
			if (itemEquipped.usageCount === 0) {
				equippedItems = equippedItems.filter((equipped) => {
					return equipped.name != item;
				});
			}
		}
	}

	await userSchema.findByIdAndUpdate(member.id, { equippedItems: equippedItems });
}

/**
 *
 * @param {Client} client
 * @param {User} user
 * @description Check if the user is a premium user
 * @async
 * @example checkIfUserIsPremium(client, user) // true
 * @returns {Promise<boolean>}
 */
async function checkIfUserIsPremium(id, client) {
	const { premium } = await userSchema.findById(id, 'premium');

	// Here we first check the database because it's faster than fetching things from the discord API
	if (premium.active && Date.now() < premium.expires) {
		return true;
	}

	// cache is false, otherwise if the user roles change while the program is running, it won't be updated
	const guild = await client.guilds.fetch('742332099788275732');

	// If the user is not in the guild, we return false
	try {
		var member = await guild.members.fetch({ user: id, cache: false });
	} catch {
		return false;
	}

	// If the user is a premium user, we update the database and return true
	if (member.roles.cache.has('1204182200476639312')) {
		await userSchema.findByIdAndUpdate(id, {
			'premium.expires': Date.now() + 1000 * 60 * 60 * 24 * 30,
			'premium.active': true,
		});
		return true;
	}
	return false;
}

module.exports = {
	msToTime,
	format,
	randint,
	paginate,
	pick,
	setCooldown,
	buttons,
	isEquipped,
	useItem,
	resolveCooldown,
	checkIfUserIsPremium,
};
