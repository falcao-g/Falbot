const { SlashCommandBuilder } = require('discord.js');
const { format, readFile } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setNameLocalization('pt-BR', 'estatísticas')
		.setDescription("Shows your or another user's statistics")
		.setDescriptionLocalization('pt-BR', 'Mostra as suas estatísticas ou a de outro usuário')
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalization('pt-BR', 'usuário')
				.setDescription('the user you want to get info about, leave blank to get your stats')
				.setDescriptionLocalization(
					'pt-BR',
					'o usuário que você deseja ver as estatísticas, deixe vazio para ver a sua'
				)
				.setRequired(false)
		),
	execute: async ({ guild, member, instance, interaction }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var user = interaction.options.getUser('user');
			const target = user ? await guild.members.fetch(user.id) : member;
			const stats = await readFile(target.id, 'stats');
			const rank_number = await readFile(target.id, 'rank');

			const embed = instance
				.createEmbed(target.displayColor)
				.setTitle(instance.getMessage(interaction, 'STATS_TITLE', { USER: target.displayName }))
				.addFields(
					{
						name: ':arrow_up: Rankups',
						value: `${format(rank_number - 1)} rankups`,
						inline: true,
					},
					{
						name: `:pager: ${instance.getMessage(interaction, 'STATS_TOTAL_COMMANDS')}`,
						value: `${format(stats.get('commands'))} ${instance.getMessage(interaction, 'STATS_COMMANDS')}`,
						inline: true,
					},
					{
						name: `:mag: ${instance.getMessage(interaction, 'STATS_ITEMS_FOUND')}`,
						value: `${format(stats.get('itemsFound'))} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					},
					{
						name: `:briefcase: ${instance.getMessage(interaction, 'STATS_WORK')}`,
						value: `${format(stats.get('timesWorked'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:compass: ${instance.getMessage(interaction, 'STATS_EXPLORE')}`,
						value: `${format(stats.get('timesExplored'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:fishing_pole_and_fish: ${instance.getMessage(interaction, 'STATS_FISH')}`,
						value: `${format(stats.get('timesFished'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:ox: ${instance.getMessage(interaction, 'STATS_HUNT')}`,
						value: `${format(stats.get('timesHunted'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:pick: ${instance.getMessage(interaction, 'STATS_MINE')}`,
						value: `${format(stats.get('timesMined'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:gift: ${instance.getMessage(interaction, 'STATS_VOTE')}`,
						value: `${format(stats.get('timesVoted'))} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:hammer_pick: ${instance.getMessage(interaction, 'STATS_CRAFTS')}`,
						value: `${format(stats.get('itemsCrafted'))} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					}
				);

			await interaction.editReply({
				embeds: [embed],
			});
		} catch (error) {
			console.error(`stats: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
