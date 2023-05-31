const {
	readFile,
	format,
	getRoleColor,
	paginate,
	getItem,
	changeDB,
	buttons,
	isEquipped,
} = require("../utils/functions.js")
const {
	EmbedBuilder,
	ButtonBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
} = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("inventory")
		.setNameLocalization("pt-BR", "inventário")
		.setDescription("Inventory actions")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setNameLocalization("pt-BR", "ver")
				.setDescription("View your inventory or of another user")
				.setDescriptionLocalization("pt-BR", "Veja o seu inventário ou o de outro usuário")
				.addUserOption((option) =>
					option
						.setName("user")
						.setNameLocalization("pt-BR", "usuário")
						.setDescription("the user you want to see the inventory, leave blank to get your inventory")
						.setDescriptionLocalization(
							"pt-BR",
							"o usuário que você deseja ver o inventário, deixe vazio para ver o seu"
						)
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("calc")
				.setNameLocalization("pt-BR", "calcular")
				.setDescription("Calculate crafting materials or items cost")
				.setDescriptionLocalization("pt-BR", "Calcule materias e custo para construção")
				.addStringOption((option) =>
					option
						.setName("item")
						.setDescription("item to calculate")
						.setDescriptionLocalization("pt-BR", "item para calcular")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setNameLocalization("pt-BR", "quantidade")
						.setDescription("amount of the item")
						.setDescriptionLocalization("pt-BR", "quantidade do item")
						.setRequired(true)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("sell")
				.setNameLocalization("pt-BR", "vender")
				.setDescription("Sell items to the market")
				.setDescriptionLocalization("pt-BR", "Vende items para o mercado")
				.addStringOption((option) =>
					option
						.setName("item")
						.setDescription("item to sell")
						.setDescriptionLocalization("pt-BR", "item para vender")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setNameLocalization("pt-BR", "quantidade")
						.setDescription("amount of the item")
						.setDescriptionLocalization("pt-BR", "quantidade do item")
						.setRequired(true)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("equip")
				.setNameLocalization("pt-BR", "equipar")
				.setDescription("Equip an item or leave blank to see equippable items")
				.setDescriptionLocalization("pt-BR", "Equipe um item ou deixe vazio para ver os itens equipáveis")
				.addStringOption((option) =>
					option
						.setName("item")
						.setDescription("item to equip")
						.setDescriptionLocalization("pt-BR", "item para equipar")
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("craft")
				.setNameLocalization("pt-BR", "construir")
				.setDescription("Craft an item")
				.setDescriptionLocalization("pt-BR", "Construa um item")
				.addStringOption((option) =>
					option
						.setName("item")
						.setDescription("item to craft")
						.setDescriptionLocalization("pt-BR", "item para construir")
						.setRequired(false)
				)
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setNameLocalization("pt-BR", "quantidade")
						.setDescription("amount of the item")
						.setDescriptionLocalization("pt-BR", "quantidade do item")
						.setRequired(false)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("sellall")
				.setNameLocalization("pt-BR", "vendertudo")
				.setDescription("Sell (almost) entire inventory to bot")
				.setDescriptionLocalization("pt-BR", "Venda (quase) todo o inventário para o bot")
				.addStringOption((option) =>
					option
						.setName("lootonly")
						.setNameLocalization("pt-BR", "somente-loot")
						.setDescription("sell only loot items")
						.setDescriptionLocalization("pt-BR", "venda apenas itens de loot")
						.setRequired(true)
						.addChoices(
							{
								name: "yes",
								name_localizations: { "pt-BR": "sim" },
								value: "yes",
							},
							{
								name: "no",
								name_localizations: { "pt-BR": "não" },
								value: "no",
							}
						)
				)
		),
	execute: async ({ guild, interaction, instance, member, subcommand }) => {
		try {
			await interaction.deferReply()
			try {
				var type = interaction.options.getSubcommand()
			} catch {
				var type = subcommand
			}
			const items = instance.items
			const language = instance.getLanguage(guild)

			if (type === "view") {
				if (subcommand != "view") {
					var option = interaction.options.getUser("user")
				}

				const target = option ? await guild.members.fetch(option.id) : member
				const inventory = await readFile(target.id, "inventory")
				const limit = instance.levels[(await readFile(target.id, "rank")) - 1].inventoryLimit
				const inventoryWorth = instance.getInventoryWorth(inventory)

				if (inventory === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "NO_ITEMS"),
					})
					return
				}

				// Create an array of inventory items with their quantity as a string
				const inventoryItems = Array.from(inventory).reduce((acc, [itemName, quantity]) => {
					if (quantity !== 0) {
						acc.push(`${items[itemName][language]} x ${quantity}`)
					}
					return acc
				}, [])

				// Calculate the number of required embeds based on the number of inventory items
				const numEmbeds = Math.ceil(inventoryItems.length / 24) || 1

				// Create an array of embeds, each with up to 24 items split across three fields
				const embeds = []
				for (let i = 0; i < numEmbeds; i++) {
					const startIndex = i * 24
					const itemsChunk = inventoryItems.slice(startIndex, startIndex + 24)

					const embed = new EmbedBuilder()
						.setColor(await getRoleColor(guild, member.id))
						.setTitle(
							instance.getMessage(guild, "INVENTORY_TITLE", {
								MEMBER: member.displayName,
								NUMBER: i + 1,
								TOTAL: numEmbeds,
								WORTH: format(inventoryWorth),
								LIMIT: format(limit),
							})
						)
						.setFooter({ text: "by Falcão ❤️" })

					for (let j = 0; j < itemsChunk.length; j += 8) {
						const itemsChunkSubset = itemsChunk.slice(j, j + 8)
						embed.addFields({
							name: "Items",
							value: itemsChunkSubset.join("\n"),
							inline: true,
						})
					}

					embeds.push(embed)
				}

				const paginator = paginate()
				paginator.add(...embeds)
				const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
				paginator.setTraverser([
					new ButtonBuilder().setEmoji("⬅️").setCustomId(ids[0]).setStyle("Secondary"),
					new ButtonBuilder().setEmoji("➡️").setCustomId(ids[1]).setStyle("Secondary"),
					new ButtonBuilder()
						.setEmoji("⚒")
						.setCustomId("inventory craft")
						.setStyle("Secondary")
						.setLabel(instance.getMessage(guild, "CRAFT")),
				])
				const message = await interaction.editReply(paginator.components())
				message.channel.createMessageComponentCollector().on("collect", async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back()
						await i.update(paginator.components())
					} else if (i.customId === ids[1]) {
						await paginator.next()
						await i.update(paginator.components())
					}
				})
			} else if (type === "calc") {
				const item = interaction.options.getString("item").toLowerCase()
				const amount = interaction.options.getInteger("amount")
				const itemJSON = items[getItem(item)]

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: item,
						}),
					})
					return
				}

				if (itemJSON.recipe != undefined) {
					var ingredients = `**${instance.getMessage(guild, "INGREDIENTS")}**`

					for (key in itemJSON.recipe) {
						ingredients += `\n${items[key][language]} x ${itemJSON.recipe[key] * amount}`
					}
				}

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, member.id))
					.setTitle(instance.getMessage(guild, "CALCULATOR"))
					.addFields({
						name: `${itemJSON[language]} x ${amount}`,
						value: `${ingredients != undefined ? ingredients : ""}\n${instance.getMessage(guild, "COST")} **${format(
							itemJSON.value * amount
						)} falcoins**`,
					})
					.setFooter({ text: "by Falcão ❤️" })

				interaction.editReply({
					embeds: [embed],
				})
			} else if (type === "sell") {
				const inventory = await readFile(member.id, "inventory")
				const item = interaction.options.getString("item").toLowerCase()
				const itemKey = getItem(item)
				const itemJSON = items[itemKey]

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: item,
						}),
					})
					return
				}

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "NO_ITEM"),
					})
					return
				}

				const amount = Math.min(inventory.get(itemKey), interaction.options.getInteger("amount"))
				const falcoins = itemJSON.value * amount

				inventory.set(itemKey, inventory.get(itemKey) - amount)
				await changeDB(member.id, "inventory", inventory, true)
				await changeDB(member.id, "falcoins", falcoins)

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, member.id))
					.addFields({
						name: instance.getMessage(guild, "SOLD_TITLE", {
							AMOUNT: format(amount),
							ITEM: itemJSON[language],
							FALCOINS: format(falcoins),
						}),
						value: instance.getMessage(guild, "SOLD_FIELD", {
							REMAINING: format(inventory.get(itemKey)),
							FALCOINS2: format(Number(falcoins / amount)),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })

				interaction.editReply({
					embeds: [embed],
					components: [buttons(["inventory_view", "balance"])],
				})
			} else if (type === "equip") {
				const inventory = await readFile(member.id, "inventory")
				const equippedItems = await readFile(member.id, "equippedItems")
				const item = interaction.options.getString("item")

				if (item === null) {
					const embed = new EmbedBuilder()
						.setColor(await getRoleColor(guild, member.id))
						.setFooter({ text: "by Falcão ❤️" })

					listItems = []
					for (key in items) {
						if (items[key].equip === true) {
							listItems.push(
								items[key][language] +
									" - " +
									instance.getMessage(guild, items[key]["effect"].toUpperCase()).split(":")[2]
							)
						}
					}
					embed.addFields({
						name: instance.getMessage(guild, "EQUIP_TITLE"),
						value: listItems.join("\n"),
					})

					interaction.editReply({
						embeds: [embed],
					})
					return
				}

				const itemKey = getItem(item.toLowerCase())
				const itemJSON = items[itemKey]

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: item,
						}),
					})
					return
				}

				if (itemJSON.equip != true) {
					interaction.editReply({
						content: instance.getMessage(guild, "CANT_EQUIP"),
					})
					return
				}

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "NO_ITEM"),
					})
					return
				}

				if (await isEquipped(member, itemKey)) {
					interaction.editReply({
						content: instance.getMessage(guild, "ALREADY_EQUIPPED"),
					})
					return
				}

				equippedItems.push({ name: itemKey, usageCount: 3 })
				inventory.set(itemKey, inventory.get(itemKey) - 1)
				await changeDB(member.id, "equippedItems", equippedItems, true)
				await changeDB(member.id, "inventory", inventory, true)

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, member.id))
					.addFields({
						name: instance.getMessage(guild, "EQUIPPED_TITLE", {
							ITEM: itemJSON[language],
						}),
						value: instance.getMessage(guild, "EQUIPPED_VALUE", {
							ITEM: itemJSON[language],
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })

				interaction.editReply({
					embeds: [embed],
				})
			} else if (type === "craft") {
				const inventory = await readFile(member.id, "inventory")
				if (interaction.options !== undefined) {
					var item = interaction.options.getString("item")
					var amount = interaction.options.getInteger("amount") || 1
				} else {
					if (interaction.values !== undefined) {
						var item = interaction.values[0]
						var amount = 1
					} else {
						if (interaction.customId.startsWith("craft")) {
							var item = interaction.customId.split(" ")[2]
							var amount = Number(interaction.customId.split(" ")[1])
						} else {
							var item = null
							var amount = null
						}
					}
				}

				//the bot sends a string select menu containing all items that can be crafted
				if (item === null || amount === null) {
					const row = new ActionRowBuilder().addComponents([
						new StringSelectMenuBuilder()
							.setCustomId("craft")
							.setPlaceholder(instance.getMessage(guild, "CRAFT_PLACEHOLDER"))
							.addOptions(
								Object.keys(items)
									.map((item) => {
										if (items[item].recipe === undefined) return

										for (key in items[item].recipe) {
											if ((inventory.get(key) || 0) < items[item].recipe[key]) return
										}

										return {
											label: items[item][language].split(":")[2],
											value: item,
											emoji: items[item].emoji,
										}
									})
									.filter((item) => item !== undefined)
							),
					])

					const embed = new EmbedBuilder()
						.setColor(await getRoleColor(guild, member.id))
						.addFields({
							name: instance.getMessage(guild, "CRAFT_TITLE"),
							value: instance.getMessage(guild, "CRAFT_VALUE"),
						})
						.setFooter({ text: "by Falcão ❤️" })

					interaction.editReply({
						components: [row],
						embeds: [embed],
					})
					return
				}

				const itemKey = getItem(item.toLowerCase())
				const itemJSON = items[itemKey]

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: item,
						}),
					})
					return
				}

				if (itemJSON.recipe === undefined) {
					interaction.editReply({
						content: instance.getMessage(guild, "CANT_CRAFT"),
					})
					return
				}

				ingredients = []
				missingIngredients = []
				for (key in itemJSON.recipe) {
					const ingredientJSON = items[key]
					const ingredientAmount = itemJSON.recipe[key] * amount

					if ((inventory.get(key) || 0) < ingredientAmount) {
						missingIngredients.push(
							`${ingredientJSON[language]} x ${format(ingredientAmount - (inventory.get(key) || 0))}`
						)
					}

					inventory.set(key, inventory.get(key) - ingredientAmount)
					ingredients.push(`${ingredientJSON[language]}: ${format(ingredientAmount)}`)
				}

				if (missingIngredients.length > 0) {
					interaction.editReply({
						content: instance.getMessage(guild, "MISSING_INGREDIENTS", {
							ITEMS: missingIngredients.join(", "),
						}),
					})
					return
				}

				//get how many more of that item you could make with the ingredients you have
				const maxAmount = Math.min(
					...Object.keys(itemJSON.recipe).map((key) => {
						return Math.floor(inventory.get(key) / itemJSON.recipe[key])
					})
				)

				if (inventory.get(itemKey) === undefined) {
					inventory.set(itemKey, 0)
				}

				inventory.set(itemKey, inventory.get(itemKey) + amount)
				await changeDB(member.id, "inventory", inventory, true)

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, member.id))
					.addFields({
						name: instance.getMessage(guild, "CRAFTED_TITLE", {
							ITEM: itemJSON[language],
							AMOUNT: format(amount),
						}),
						value: instance.getMessage(guild, "CRAFTED_VALUE", {
							INGREDIENTS: ingredients.join("\n"),
							ITEM: itemJSON[language],
							AMOUNT: format(amount),
							MAXAMOUNT: format(maxAmount),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })

				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setCustomId(`craft 1 ${itemKey}`)
						.setLabel(instance.getMessage(guild, "CRAFT") + " 1")
						.setStyle("Secondary"),
					new ButtonBuilder()
						.setCustomId(`craft 10 ${itemKey}`)
						.setLabel(instance.getMessage(guild, "CRAFT") + " 10")
						.setStyle("Secondary"),
					new ButtonBuilder()
						.setCustomId(`craft 100 ${itemKey}`)
						.setLabel(instance.getMessage(guild, "CRAFT") + " 100")
						.setStyle("Secondary"),
					new ButtonBuilder()
						.setCustomId(`craft ${maxAmount} ${itemKey} max`)
						.setLabel(instance.getMessage(guild, "CRAFT_MAX"))
						.setStyle("Secondary"),
				])

				interaction.editReply({
					embeds: [embed],
					components: [row],
				})
			} else if (type === "sellall") {
				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, member.id))
					.addFields({
						name: instance.getMessage(guild, "SELLALL_TITLE"),
						value: instance.getMessage(guild, "SELLALL_VALUE"),
					})
					.setFooter({ text: "by Falcão ❤️" })

				interaction.editReply({
					embeds: [embed],
					components: [buttons(["accept"])],
				})

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member.id
				}

				const collector = interaction.channel.createMessageComponentCollector({
					filter,
					time: 1000 * 300,
				})

				collector.on("collect", async (i) => {
					const lootonly = interaction.options.getString("lootonly")
					const inventory = await readFile(member.id, "inventory")
					var itemsSold = []
					let falcoins = 0

					for (key of inventory.keys()) {
						const itemJSON = items[key]

						if (lootonly === "yes") {
							if (
								itemJSON.hunting === undefined &&
								itemJSON.fishing === undefined &&
								itemJSON.exploring === undefined &&
								itemJSON.mining === undefined
							) {
								continue
							}
						}

						if (itemJSON.rarity === "Legendary" || inventory.get(key) === 0) {
							continue
						}

						falcoins += itemJSON.value * inventory.get(key)
						itemsSold.push(`${itemJSON[language]}: ${format(inventory.get(key))}`)
						inventory.set(key, 0)
					}

					await changeDB(member.id, "falcoins", falcoins)
					await changeDB(member.id, "inventory", inventory, true)

					if (itemsSold.length > 10) {
						var length = itemsSold.length
						itemsSold = itemsSold.splice(0, 10)
						itemsSold.push(
							instance.getMessage(guild, "MORE", {
								AMOUNT: format(length - 10),
							})
						)
					}

					const embed = new EmbedBuilder()
						.setColor(await getRoleColor(guild, member.id))
						.addFields({
							name: instance.getMessage(guild, "SELLALL_CONFIRMED_TITLE"),
							value: instance.getMessage(guild, "SELLALL_CONFIRMED_VALUE", {
								ITEMS: itemsSold.join("\n"),
								FALCOINS: format(falcoins),
							}),
						})
						.setFooter({ text: "by Falcão ❤️" })

					i.update({
						embeds: [embed],
						components: [],
					})
				})
			}
		} catch (err) {
			console.error(`inventory: ${err}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
