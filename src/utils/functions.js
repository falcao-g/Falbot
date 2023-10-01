const userSchema = require('../schemas/user-schema');
const { ActionRowBuilder, ButtonBuilder, GuildMember } = require('discord.js');
const items = require('./json/items.json');

/**
 *
 * @param {DiscordID} id
 * @description Creates a new user in the database if it doesn't exist
 * @async
 * @returns {Promise<void>}
 */
async function createUser(id) {
	try {
		await userSchema.findByIdAndUpdate(
			id,
			{
				_id: id,
			},
			{
				upsert: true,
			}
		);
	} catch (error) {
		console.error(`Erro ao criar usuário: ${error}`);
	}
}

/**
 *
 * @param {DiscordID} id
 * @param {string} field
 * @param {integer} quantity
 * @param {boolean} erase
 * @description Changes the value of a user's document field in the database
 * @example changeDB(id, 'falcoins', 1000, false) // Adds 1000 falcoins to the user
 * @async
 * @returns {Promise<void>}
 */
async function changeDB(id, field, quantity = 1, erase = false) {
	try {
		await createUser(id);
		if (erase == true) {
			await userSchema.findByIdAndUpdate(id, {
				[field]: quantity,
			});
		} else {
			await userSchema.findByIdAndUpdate(id, {
				$inc: {
					[field]: quantity,
				},
			});
		}
	} catch (error) {
		console.error(`Erro ao mudar a database: ${error}`);
	}
}

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
 * @param {integer} arg
 * @param {DiscordID} id
 * @param {string} field
 * @description Converts a string to an integer
 * @example specialArg('100.000.000', id, 'falcoins') // 100000000
 * @async
 * @returns {Promise<integer>}
 */
async function specialArg(arg, id, field = 'falcoins') {
	await createUser(id);
	var user = await userSchema.findById(id);

	arg = arg.toString();
	arg = arg.toLowerCase();

	new_arg = '';
	for (c in arg) {
		if (arg[c] != '.' && arg[c] != ',') {
			new_arg += arg[c];
		}
	}

	if (new_arg == 'tudo' || new_arg == 'all') {
		new_arg = user[field];
	} else if (new_arg == 'metade' || new_arg == 'half') {
		new_arg = parseInt(user[field] / 2);
	} else if (new_arg.slice(-1) === 'k') {
		new_arg = new_arg.slice(0, -1);
		new_arg += '000';
	} else if (new_arg.slice(-1) === 'm') {
		new_arg = new_arg.slice(0, -1);
		new_arg += '000000';
	} else if (new_arg.slice(-1) === 'b') {
		new_arg = new_arg.slice(0, -1);
		new_arg += '000000000';
	} else if (new_arg.slice(-1) === 't') {
		new_arg = new_arg.slice(0, -1);
		new_arg += '000000000000';
	} else {
		for (c in new_arg) {
			if (new_arg[c] == '%') {
				new_arg = parseInt((parseInt(new_arg.slice(0, -1)) * parseInt(user[field])) / 100);
			}
		}
	}
	if (parseInt(new_arg) <= 0 || isNaN(parseInt(new_arg))) {
		throw Error('Invalid value!');
	} else {
		return parseInt(new_arg);
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
 * @param {DiscordID} id
 * @param {string} field
 * @param {boolean} rich
 * @description Reads a user's document field in the database
 * @async
 * @example readFile(id, 'falcoins', true) // 1.000.000
 * @returns <Promise<any>
 */
async function readFile(id, field = '', rich = false) {
	try {
		await createUser(id);

		if (field == '') {
			return await userSchema.findById(id);
		} else if (rich == false) {
			return (await userSchema.findById(id))[field];
		} else {
			return await format((await userSchema.findById(id))[field]);
		}
	} catch (error) {
		console.error(`Erro ao ler arquivo: ${error}`);
	}
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
 * @description Picks a random element from an array based on its weight
 * @example pick([['a', 0.5], ['b', 0.3], ['c', 0.2]]) // 'a'
 * @returns {string}
 */
function pick(data) {
	// Split input into two separate arrays of values and weights.
	const values = data.map((d) => d[0]);
	const weights = data.map((d) => d[1]);

	let acc = 0;
	const sum = weights.reduce((acc, element) => acc + element, 0);
	const weightsSum = weights.map((element) => {
		acc = element + acc;
		return acc;
	});
	const rand = Math.random() * sum;

	return values[weightsSum.filter((element) => element <= rand).length];
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
	await changeDB(id, 'cooldowns', cooldowns, true);
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
			await changeDB(id, 'cooldowns', cooldowns, true);
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
	const equippedItems = await readFile(member.id, 'equippedItems');

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
	var equippedItems = await readFile(member.id, 'equippedItems');

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

	await changeDB(member.id, 'equippedItems', equippedItems, true);
}

module.exports = {
	createUser,
	changeDB,
	msToTime,
	specialArg,
	format,
	readFile,
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
