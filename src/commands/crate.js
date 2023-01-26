const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	randint,
	changeDB,
	getRoleColor,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Spend 1 key and 1 crate for a chance to get some prizes",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "quantity",
			description: "quantity of crates you wish to open",
			required: true,
			type: "NUMBER",
		},
	],
	callback: async ({ instance, guild, user, args, interaction }) => {
		try {
			await interaction.deferReply()
			try {
				var quantity = await specialArg(args[0], user.id, "caixas")
			} catch {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "VALOR_INVALIDO", {
						VALUE: args[0],
					}),
				})
				return
			}
			if (
				(await readFile(user.id, "caixas")) >= quantity &&
				(await readFile(user.id, "chaves")) >= quantity
			) {
				caixas = 0
				chaves = 0
				falcoins = 0
				for (let i = 0; i < quantity; i++) {
					var luck = randint(1, 60)
					if (luck <= 40) {
						chaves += Math.round(Math.random())
						caixas += Math.round(Math.random())
						falcoins += randint(500, 15000)
					}
				}
				changeDB(user.id, "chaves", chaves - quantity)
				changeDB(user.id, "caixas", caixas - quantity)
				changeDB(user.id, "falcoins", falcoins)
				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: instance.messageHandler.get(guild, "CAIXA_TITULO", {
							QUANTITY: args[0],
						}),
						value: `:key: ${chaves}\n:coin: ${await format(
							falcoins
						)} \n:gift: ${caixas}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				interaction.editReply({ embeds: [embed] })
			} else {
				interaction.editReply({
					content: instance.messageHandler.get(guild, "CAIXA_INSUFICIENTE", {
						VALUE: args[0],
					}),
				})
			}
		} catch (error) {
			console.error(`crate: ${error}`)
		}
	},
}
