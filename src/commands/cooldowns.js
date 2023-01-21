const { MessageEmbed } = require("discord.js")
const { readFile, getRoleColor, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const lottoSchema = require("../schemas/lotto-schema")
const { MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
	description: "Shows your commands cooldowns",
	slash: true,
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			voteCooldown = Date.now() - (await readFile(user.id, "lastVote"))
			cooldownsSchema =
				instance._mongoConnection.models["wokcommands-cooldowns"]
			scratchCooldown = await cooldownsSchema.findById(`scratch-${user.id}`)
			workCooldown = await cooldownsSchema.findById(`work-${user.id}`)
			lotto = await lottoSchema.findById("semanal")
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.setTitle(instance.messageHandler.get(guild, "COOLDOWNS"))
				.addFields(
					{
						name: ":ballot_box: " + instance.messageHandler.get(guild, "VOTO"),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${await msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${instance.messageHandler.get(
										guild,
										"PRONTO"
								  )}`
						}**`,
						inline: true,
					},
					{
						name:
							":slot_machine: " + instance.messageHandler.get(guild, "SCRATCH"),
						value: `**${
							scratchCooldown
								? `:red_circle: ${await msToTime(
										scratchCooldown["cooldown"] * 1000
								  )}`
								: `:green_circle: ${instance.messageHandler.get(
										guild,
										"PRONTO"
								  )}`
						}**`,
						inline: true,
					},
					{
						name:
							":briefcase: " + instance.messageHandler.get(guild, "TRABALHO"),
						value: `**${
							workCooldown
								? `:red_circle: ${await msToTime(
										workCooldown["cooldown"] * 1000
								  )}`
								: `:green_circle: ${instance.messageHandler.get(
										guild,
										"PRONTO"
								  )}`
						}**`,
						inline: true,
					},
					{
						name:
							":loudspeaker: " + instance.messageHandler.get(guild, "EVENTS"),
						value: `**${instance.messageHandler.get(
							guild,
							"LOTTERY"
						)}** - ${instance.messageHandler.get(guild, "LOTTERY_DRAWN", {
							TIME: await msToTime(lotto.nextDraw - Date.now()),
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
		}
	},
}
