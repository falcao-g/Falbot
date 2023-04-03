const {
	format,
	getRoleColor,
	getItem,
	readFile,
} = require("../utils/functions.js")
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("iteminfo")
		.setDescription("View item info")
		.setDescriptionLocalization("pt-BR", "Veja informações sobre um item")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("item")
				.setDescription("item to see information about")
				.setDescriptionLocalization("pt-BR", "item para ver informações sobre")
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, member }) => {
		try {
			await interaction.deferReply()
			const items = instance.items
			const language = instance.getLanguage(guild)

			const item = interaction.options.getString("item").toLowerCase()
			const itemKey = getItem(item)
			const itemJSON = items[itemKey]
			const inventory = await readFile(member.id, "inventory")

			if (itemJSON === undefined) {
				interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: item,
					}),
				})
				return
			}

			if (itemJSON.recipe != undefined) {
				var ingredients = ""

				for (key in itemJSON.recipe) {
					ingredients += `\n${items[key][language]} x ${itemJSON.recipe[key]}`
				}
			}

			var information = `:moneybag: ${instance.getMessage(
				guild,
				"COST"
			)} **${format(itemJSON.value)} falcoins**`

			if (inventory.get(itemKey))
				information += `\n${instance.getMessage(guild, "OWNED", {
					AMOUNT: inventory.get(itemKey),
				})}`

			if (itemJSON.equip != undefined) {
				information += `\n${instance.getMessage(guild, "USEABLE")}`
				information += `\n${instance.getMessage(
					guild,
					itemJSON.effect.toUpperCase()
				)}`
			}

			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, member.id))
				.setTitle(`${itemJSON[language]} ` + "(`" + `${itemKey}` + "`)")
				.addFields({
					name: instance.getMessage(guild, "INFO"),
					value: information,
				})
				.setFooter({ text: "by Falcão ❤️" })

			if (itemJSON.rarity) {
				embed.setDescription(
					`**${instance.getMessage(guild, itemJSON.rarity.toUpperCase())}**`
				)
			}

			if (ingredients) {
				embed.addFields({
					name: instance.getMessage(guild, "INGREDIENTS"),
					value: ingredients,
				})
			}

			var usedToCraft = ""
			var cont = 0
			craft: for (i in items) {
				if (items[i].recipe != undefined) {
					for (key in items[i].recipe) {
						if (key === itemKey) {
							usedToCraft += `\n${items[i][language]}`
							cont += 1

							if (cont === 4) {
								usedToCraft += instance.getMessage(guild, "AND_MORE")
								break craft
							}
						}
					}
				}
			}

			if (usedToCraft.length != "") {
				embed.addFields({
					name: instance.getMessage(guild, "USED"),
					value: usedToCraft,
				})
			}

			interaction.editReply({
				embeds: [embed],
			})
		} catch (err) {
			console.error(`iteminfo: ${err}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
