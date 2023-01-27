const userSchema = require("../schemas/user-schema")
const { MessageActionRow } = require("discord.js")

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
		)
	} catch (error) {
		console.error(`Erro ao criar usuário: ${error}`)
	}
}

async function changeDB(id, field, quantity = 1, erase = false) {
	try {
		await createUser(id)
		if (erase == true) {
			await userSchema.findByIdAndUpdate(id, {
				[field]: quantity,
			})
		} else {
			await userSchema.findByIdAndUpdate(id, {
				$inc: {
					[field]: quantity,
				},
			})
		}
	} catch (error) {
		console.error(`Erro ao mudar a database: ${error}`)
	}
}

async function takeAndGive(id, id2, field, field2, quantity = 1) {
	try {
		await createUser(id)
		await createUser(id2)
		await userSchema.findByIdAndUpdate(id, { $inc: { [field]: -quantity } })
		await userSchema.findByIdAndUpdate(id2, { $inc: { [field2]: quantity } })
	} catch {
		console.error(`Erro ao alterar a database no takeAndGive: ${error}`)
	}
}

async function msToTime(ms) {
	let time = ""

	let n = 0
	if (ms >= 2592000000) {
		n = Math.floor(ms / 2592000000)
		time += `${n}m `
		ms -= n * 2592000000
	}

	if (ms >= 86400000) {
		n = Math.floor(ms / 86400000)
		time += `${n}d `
		ms -= n * 86400000
	}

	if (ms >= 3600000) {
		n = Math.floor(ms / 3600000)
		time += `${n}h `
		ms -= n * 3600000
	}

	if (ms >= 60000) {
		n = Math.floor(ms / 60000)
		time += `${n}m `
		ms -= n * 60000
	}

	return time.trimEnd()
}

async function specialArg(arg, id, field = "falcoins") {
	await createUser(id)
	var user = await userSchema.findById(id)

	arg = arg.toString()
	arg = arg.toLowerCase()

	new_arg = ""
	for (c in arg) {
		if (arg[c] != "." && arg[c] != ",") {
			new_arg += arg[c]
		}
	}

	if (new_arg == "tudo" || new_arg == "all") {
		new_arg = user[field]
	} else if (new_arg == "metade" || new_arg == "half") {
		new_arg = parseInt(user[field] / 2)
	} else if (new_arg.slice(-1) === "m") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000"
	} else if (new_arg.slice(-1) === "b") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000000"
	} else if (new_arg.slice(-1) === "t") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000000000"
	} else {
		for (c in new_arg) {
			if (new_arg[c] == "%") {
				new_arg = parseInt(
					(parseInt(new_arg.slice(0, -1)) * parseInt(user[field])) / 100
				)
			}
		}
	}
	if (parseInt(new_arg) < 0 || isNaN(parseInt(new_arg))) {
		throw Error("Argumento inválido!")
	} else {
		return parseInt(new_arg)
	}
}

async function format(falcoins) {
	if (parseInt(falcoins) < 0) {
		falcoins = falcoins.toString()
		pop = falcoins.slice(1)
	} else {
		pop = falcoins.toString()
	}
	pop_reverse = pop.split("").reverse().join("")
	pop_2 = ""
	for (c in pop_reverse) {
		if (c / 3 == parseInt(c / 3) && c / 3 != 0) {
			pop_2 += "."
			pop_2 += pop_reverse[c]
		} else {
			pop_2 += pop_reverse[c]
		}
	}
	return pop_2.split("").reverse().join("")
}

async function readFile(id, field = "", rich = false) {
	try {
		await createUser(id)

		if (field == "") {
			return await userSchema.findById(id)
		} else if (rich == false) {
			return (await userSchema.findById(id))[field]
		} else {
			return await format((await userSchema.findById(id))[field])
		}
	} catch (error) {
		console.error(`Erro ao ler arquivo: ${error}`)
	}
}

async function getRoleColor(guild, member_id) {
	try {
		cor = guild.members.cache.get(member_id).displayColor
		return cor
	} catch (err) {
		return "RANDOM"
	}
}

async function getMember(guild, member_id) {
	return guild.members.cache.get(member_id)
}

async function count(array, string) {
	var amount = 0
	for (let i = 0; i <= array.length; i++) {
		if (array[i - 1] === string) {
			amount += 1
		}
	}
	return amount
}

function randint(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low)
}

async function paginate() {
	const __embeds = []
	let cur = 0
	let traverser
	let message
	return {
		add(...embeds) {
			__embeds.push(...embeds)
			return this
		},
		setTraverser(tr) {
			traverser = tr
		},
		setMessage(_message) {
			message = _message
		},
		async next() {
			cur++
			if (cur >= __embeds.length) {
				cur = 0
			}
		},
		async back() {
			cur--
			if (cur <= -__embeds.length) {
				cur = 0
			}
		},
		at(num) {
			return __embeds.at(num)
		},
		components() {
			return {
				embeds: [__embeds.at(cur)],
				components: [
					new MessageActionRow().addComponents(traverser[0], traverser[1]),
				],
				fetchReply: true,
			}
		},
	}
}

module.exports = {
	createUser,
	changeDB,
	msToTime,
	specialArg,
	format,
	readFile,
	getRoleColor,
	getMember,
	takeAndGive,
	count,
	randint,
	paginate,
}
