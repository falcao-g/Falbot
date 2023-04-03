const {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	SlashCommandBuilder,
} = require("discord.js")
const { readFile, getRoleColor, msToTime } = require("../utils/functions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cooldowns")
		.setNameLocalization("pt-BR", "intervalos")
		.setDescription("Shows your commands cooldowns")
		.setDescriptionLocalization(
			"pt-BR",
			"Veja o tempo que falta para poder usar certos comandos"
		)
		.setDMPermission(false),
	execute: async ({ guild, user, interaction, instance }) => {
		await interaction.deferReply()
		try {
			const voteCooldown = Date.now() - (await readFile(user.id, "lastVote"))
			const scratchCooldown = await instance.coolSchema.findById(
				`scratch-${user.id}`
			)
			const workCooldown = await instance.coolSchema.findById(`work-${user.id}`)
			const fishCooldown = await instance.coolSchema.findById(`fish-${user.id}`)
			const exploreCooldown = await instance.coolSchema.findById(
				`explore-${user.id}`
			)
			const mineCooldown = await instance.coolSchema.findById(`mine-${user.id}`)
			const huntCooldown = await instance.coolSchema.findById(`hunt-${user.id}`)
			const lotto = await instance.lottoSchema.findById("semanal")
			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.setTitle(instance.getMessage(guild, "COOLDOWNS"))
				.addFields(
					{
						name: ":ballot_box: " + instance.getMessage(guild, "VOTO"),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":slot_machine: " + instance.getMessage(guild, "SCRATCH"),
						value: `**${
							scratchCooldown
								? `:red_circle: ${msToTime(scratchCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":briefcase: " + instance.getMessage(guild, "TRABALHO"),
						value: `**${
							workCooldown
								? `:red_circle: ${msToTime(workCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name:
							":fishing_pole_and_fish: " + instance.getMessage(guild, "FISH"),
						value: `**${
							fishCooldown
								? `:red_circle: ${msToTime(fishCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":compass: " + instance.getMessage(guild, "EXPLORE"),
						value: `**${
							exploreCooldown
								? `:red_circle: ${msToTime(exploreCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":pick: " + instance.getMessage(guild, "MINE"),
						value: `**${
							mineCooldown
								? `:red_circle: ${msToTime(mineCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":crossed_swords: " + instance.getMessage(guild, "HUNT"),
						value: `**${
							huntCooldown
								? `:red_circle: ${msToTime(huntCooldown["cooldown"] * 1000)}`
								: `:green_circle: ${instance.getMessage(guild, "PRONTO")}`
						}**`,
						inline: true,
					},
					{
						name: ":loudspeaker: " + instance.getMessage(guild, "EVENTS"),
						value: `**${instance.getMessage(
							guild,
							"LOTTERY"
						)}** - ${instance.getMessage(guild, "LOTTERY_DRAWN", {
							TIME: msToTime(lotto.nextDraw - Date.now()),
						})}`,
						inline: false,
					}
				)

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("vote")
					.setEmoji("🗳️")
					.setStyle(voteCooldown < 43200000 ? "Danger" : "Success")
					.setDisabled(voteCooldown < 43200000 ? true : false),
				new ButtonBuilder()
					.setCustomId("scratch")
					.setEmoji("🎰")
					.setStyle(scratchCooldown ? "Danger" : "Success")
					.setDisabled(scratchCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId("work")
					.setEmoji("💼")
					.setStyle(workCooldown ? "Danger" : "Success")
					.setDisabled(workCooldown ? true : false),
			])

			const row2 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("fish")
					.setEmoji("🎣")
					.setStyle(fishCooldown ? "Danger" : "Success")
					.setDisabled(fishCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId("explore")
					.setEmoji("🧭")
					.setStyle(exploreCooldown ? "Danger" : "Success")
					.setDisabled(exploreCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId("mine")
					.setEmoji("⛏️")
					.setStyle(mineCooldown ? "Danger" : "Success")
					.setDisabled(mineCooldown ? true : false),
			])

			const row3 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("hunt")
					.setEmoji("⚔️")
					.setStyle(huntCooldown ? "Danger" : "Success")
					.setDisabled(huntCooldown ? true : false),
			])

			interaction.editReply({ embeds: [embed], components: [row, row2, row3] })
		} catch (error) {
			console.error(`cooldowns: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
