const userSchema = require('../schemas/user-schema');
const { ActionRowBuilder, ButtonBuilder, GuildMember } = require('discord.js');
const items = require('./json/items.json');
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
 * @param {string} string
 * @param {integer} total
 * @description Parses a string to an integer
 * @example specialArg('10%', 1000) // 100
 * @returns {integer}
 */
function specialArg(string, total) {
	string = string.toLowerCase();
	string.replace(/,/g, '');
	string.replace(/\./g, '');
	var new_value = parseInt(string);

	if (string == 'tudo' || string == 'all' || string == 'max' || string == 'todo') {
		new_value = total;
	} else if (string == 'metade' || string == 'half' || string == 'mitad') {
		new_value = parseInt(total / 2);
	} else if (string.slice(-1) === 'k') {
		string = string.slice(0, -1);
		new_value += '000';
	} else if (string.slice(-1) === 'm') {
		string = string.slice(0, -1);
		new_value += '000000';
	} else if (string.slice(-1) === 'b') {
		string = string.slice(0, -1);
		new_value += '000000000';
	} else {
		for (c in string) {
			if (string[c] == '%') {
				new_value = parseInt((parseInt(string.slice(0, -1)) * parseInt(total)) / 100);
			}
		}
	}

	if (parseInt(new_value) <= 0 || isNaN(parseInt(new_value))) {
		throw Error('Invalid value!');
	} else {
		return parseInt(new_value);
	}
}

/**
 *
 * @param {integer} falcoins
 * @description Format a number to a string with the format "1.000.000"
 * @example format(1000000) // 1.000.000
 * @returns {string}
 */
function format(falcoins) {
	if (parseInt(falcoins) < 0) {
		falcoins = falcoins.toString();
		pop = falcoins.slice(1);
	} else {
		pop = falcoins.toString();
	}
	pop_reverse = pop.split('').reverse().join('');
	pop_2 = '';
	for (c in pop_reverse) {
		if (c / 3 == parseInt(c / 3) && c / 3 != 0) {
			pop_2 += '.';
			pop_2 += pop_reverse[c];
		} else {
			pop_2 += pop_reverse[c];
		}
	}
	return pop_2.split('').reverse().join('');
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
	let cur = 0;
	let traverser;
	return {
		add(...embeds) {
			__embeds.push(...embeds);
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
			return {
				embeds: [__embeds.at(cur)],
				components: [new ActionRowBuilder().addComponents(...traverser)],
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
	var cooldowns = (await userSchema.findById(id)).cooldowns;
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
	var cooldowns = (await userSchema.findById(id)).cooldowns;
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
 * @param {string} item
 * @description Returns the item's json key
 * @example getItem('skunk pelt') // 'skunk'
 * @returns {string}
 */
function getItem(item) {
	if (!'abcdefghijklmnopqrstuvwxyz'.includes(item[0].toLowerCase())) {
		item = item.split(' ').slice(1).join(' ');
	}

	item = item.toLowerCase();

	for (const key in items) {
		if (items[key]['pt-BR'].toLowerCase() === item || items[key]['en-US'].toLowerCase() === item) {
			return key;
		}
	}

	if (items[item] != undefined) {
		return item;
	}
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
	const equippedItems = (await userSchema.findById(member.id)).equippedItems;

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
	var equippedItems = (await userSchema.findById(member.id)).equippedItems;

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

module.exports = {
	msToTime,
	specialArg,
	format,
	randint,
	paginate,
	pick,
	setCooldown,
	getItem,
	buttons,
	isEquipped,
	useItem,
	resolveCooldown,
};
