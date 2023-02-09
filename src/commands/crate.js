const { EmbedBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	randint,
	changeDB,
	getRoleColor,
	format,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crate")
		.setNameLocalization("pt-BR", "caixa")
		.setDescription("Spend 1 key and 1 crate for a chance to get some prizes")
		.setDescriptionLocalization(
			"pt-BR",
			"Gaste 1 chave e caixa para ter a chance de ganhar prêmios"
		)
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("quantity")
				.setNameLocalization("pt-BR", "quantidade")
				.setDescription("quantity of crates you wish to open")
				.setDescriptionLocalization(
					"pt-BR",
					"quantidade de caixas que você quer abrir"
				)
				.setMinValue(1)
				.setRequired(true)
		),
	execute: async ({ guild, user, interaction, instance }) => {
		await interaction.deferReply()
		try {
			crates = interaction.options.getInteger("quantity")
			try {
				var quantity = await specialArg(crates, user.id, "caixas")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: crates,
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
				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: instance.getMessage(guild, "CAIXA_TITULO", {
							QUANTITY: crates,
						}),
						value: `:key: ${chaves}\n:coin: ${format(
							falcoins
						)} \n:gift: ${caixas}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				interaction.editReply({ embeds: [embed] })
			} else {
				interaction.editReply({
					content: instance.getMessage(guild, "CAIXA_INSUFICIENTE", {
						VALUE: crates,
					}),
				})
			}
		} catch (error) {
			console.error(`crate: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
