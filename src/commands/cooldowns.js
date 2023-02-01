const { MessageEmbed } = require("discord.js")
const { readFile, getRoleColor, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
	description: "Shows your commands cooldowns",
	slash: true,
	guildOnly: true,
	testOnly,
	init: () => {
		const { Falbot } = require("../../index.js")
	},
	callback: async ({ guild, user, interaction }) => {
		await interaction.deferReply()
		try {
			voteCooldown = Date.now() - (await readFile(user.id, "lastVote"))
			scratchCooldown = await Falbot.coolSchema.findById(`scratch-${user.id}`)
			workCooldown = await Falbot.coolSchema.findById(`work-${user.id}`)
			lotto = await Falbot.lottoSchema.findById("semanal")
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.setTitle(Falbot.getMessage(guild, "COOLDOWNS"))
				.addFields(
					{
						name: ":ballot_box: " + Falbot.getMessage(guild, "VOTO"),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${Falbot.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":slot_machine: " + Falbot.getMessage(guild, "SCRATCH"),
						value: `**${
							scratchCooldown
								? `:red_circle: ${msToTime(scratchCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${Falbot.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":briefcase: " + Falbot.getMessage(guild, "TRABALHO"),
						value: `**${
							workCooldown
								? `:red_circle: ${msToTime(workCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${Falbot.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":loudspeaker: " + Falbot.getMessage(guild, "EVENTS"),
						value: `**${Falbot.getMessage(
							guild,
							"LOTTERY"
						)}** - ${Falbot.getMessage(guild, "LOTTERY_DRAWN", {
							TIME: msToTime(lotto.nextDraw - Date.now()),
						})}`,
						inline: false,
					}
				)

			const row = new MessageActionRow().addComponents([
				new MessageButton()
					.setCustomId("vote")
					.setEmoji("🗳️")
					.setStyle(voteCooldown < 43200000 ? "DANGER" : "SUCCESS")
					.setDisabled(voteCooldown < 43200000 ? true : false),
				new MessageButton()
					.setCustomId("scratch")
					.setEmoji("🎰")
					.setStyle(scratchCooldown ? "DANGER" : "SUCCESS")
					.setDisabled(scratchCooldown ? true : false),
				new MessageButton()
					.setCustomId("work")
					.setEmoji("💼")
					.setStyle(workCooldown ? "DANGER" : "SUCCESS")
					.setDisabled(workCooldown ? true : false),
			])

			interaction.editReply({ embeds: [embed], components: [row] })
		} catch (error) {
			console.error(`cooldowns: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
