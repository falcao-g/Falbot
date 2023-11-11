const { SlashCommandBuilder } = require('discord.js');
const { format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setNameLocalizations({
			'pt-BR': 'conta',
			'es-ES': 'cuenta',
		})
		.setDescription("Shows your or another user's balance")
		.setDescriptionLocalizations({
			'pt-BR': 'Mostra a sua conta ou a de outro usuário',
			'es-ES': 'Muestra tu cuenta o la de otro usuario',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('the user you want to get info about, leave blank to get your balance')
				.setDescriptionLocalizations({
					'pt-BR': 'o usuário que você deseja ver a conta, deixe vazio para ver a sua',
					'es-ES': 'el usuario que desea obtener información, deje en blanco para obtener su saldo',
				})
				.setRequired(false)
		),
	execute: async ({ guild, member, instance, interaction, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			if (interaction.options != undefined) {
				var user = interaction.options.getUser('user');
			}
			const target = user ? await guild.members.fetch(user.id) : member;
			const { rank, falcoins, vitorias, banco } = await database.player.findOne(target.user.id);

			const embed = instance
				.createEmbed(target.displayColor)
				.setTitle(instance.getMessage(interaction, rank) + ' ' + target.displayName)
				.addFields(
					{
						name: ':coin: Falcoins',
						value: `${format(falcoins)}`,
						inline: true,
					},
					{
						name: ':trophy: ' + instance.getMessage(interaction, 'WINS'),
						value: `${format(vitorias)}`,
						inline: true,
					},
					{
						name: ':bank: ' + instance.getMessage(interaction, 'BANK'),
						value: `${format(banco)}`,
						inline: true,
					}
				);
			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(':sparkles: ' + instance.getMessage(interaction, 'MAX_RANK2'));
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				embed.setDescription(instance.getMessage(interaction, 'BALANCE_RANKUP'));
			} else {
				embed.setDescription(
					instance.getMessage(interaction, 'BALANCE_RANKUP2', {
						FALCOINS: format(instance.levels[rank - 1].falcoinsToLevelUp - falcoins),
					})
				);
			}

			instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['cooldowns', 'help'])],
			});
		} catch (error) {
			console.error(`balance: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
