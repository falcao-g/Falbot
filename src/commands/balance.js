const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const {
	getMember,
	getRoleColor,
	format,
	readFile,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Shows your or another user's balance",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "user",
			description:
				"the user you want to get info about, leave blank to get your balance",
			required: false,
			type: "USER",
		},
	],
	callback: async ({ guild, member, args, interaction }) => {
		try {
			await interaction.deferReply()
			const realMember = args[0] ? await getMember(guild, args[0]) : member
			const userFile = await readFile(realMember.user.id)

			const embed = new MessageEmbed()
				.setTitle(
					Falbot.getMessage(guild, userFile.rank) + " " + realMember.displayName
				)
				.setColor(await getRoleColor(guild, realMember.user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields(
					{
						name: ":coin: Falcoins",
						value: `${format(userFile.falcoins)}`,
						inline: true,
					},
					{
						name: ":trophy: " + Falbot.getMessage(guild, "VITORIAS"),
						value: `${format(userFile.vitorias)}`,
						inline: true,
					},
					{
						name: ":bank: " + Falbot.getMessage(guild, "BANCO"),
						value: `${format(userFile.banco)}`,
						inline: true,
					},
					{
						name: ":gift: " + Falbot.getMessage(guild, "CAIXAS"),
						value: `${format(userFile.caixas)}`,
						inline: true,
					},
					{
						name: ":key: " + Falbot.getMessage(guild, "CHAVES"),
						value: `${format(userFile.chaves)}`,
						inline: true,
					}
				)
			if (Falbot.levels[userFile.rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(
					":sparkles: " + Falbot.getMessage(guild, "MAX_RANK2")
				)
			} else if (
				Falbot.levels[userFile.rank - 1].falcoinsToLevelUp <= userFile.falcoins
			) {
				embed.setDescription(Falbot.getMessage(guild, "BALANCE_RANKUP"))
			} else {
				embed.setDescription(
					Falbot.getMessage(guild, "BALANCE_RANKUP2", {
						FALCOINS: format(
							Falbot.levels[userFile.rank - 1].falcoinsToLevelUp -
								userFile.falcoins
						),
					})
				)
			}

			const row = new MessageActionRow().addComponents([
				new MessageButton()
					.setCustomId("cooldowns")
					.setEmoji("⏱️")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("help")
					.setEmoji("📚")
					.setStyle("SECONDARY"),
			])

			await interaction.editReply({ embeds: [embed], components: [row] })
		} catch (error) {
			console.error(`balance: ${error}`)
		}
	},
}
