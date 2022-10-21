const { MessageEmbed } = require("discord.js")
const { readFile, getRoleColor, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "uteis",
	description: "Shows your commands cooldowns",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, member }) => {
		try {
			voteCooldown = Date.now() - (await readFile(user.id, "lastVote"))
			scratchSchema = instance._mongoConnection.models["wokcommands-cooldowns"]
			scratchCooldown = await scratchSchema.findById(
				`scratch-${guild.id}-${user.id}`
			)
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setAuthor({ name: member.displayName, iconURL: user.avatarURL() })
				.setFooter({ text: "by Falcão ❤️" })
				.setTitle(instance.messageHandler.get(guild, "COOLDOWNS"))
				.addField(
					":ballot_box: " + instance.messageHandler.get(guild, "VOTO"),
					`**${
						voteCooldown < 43200000
							? `:red_circle: ${await msToTime(43200000 - voteCooldown)}`
							: `:green_circle: ${instance.messageHandler.get(guild, "PRONTO")}`
					}**`,
					true
				)
				.addField(
					":slot_machine: " + instance.messageHandler.get(guild, "SCRATCH"),
					`**${
						scratchCooldown
							? `:red_circle: ${await msToTime(
									scratchCooldown["cooldown"] * 1000
							  )}`
							: `:green_circle: ${instance.messageHandler.get(guild, "PRONTO")}`
					}**`,
					true
				)

			return embed
		} catch (error) {
			console.error(`cooldowns: ${error}`)
		}
	},
}
