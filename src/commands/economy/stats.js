const { SlashCommandBuilder } = require('discord.js');
const { format } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setNameLocalizations({
			'pt-BR': 'estatisticas',
			'es-ES': 'estadisticas',
		})
		.setDescription("Shows your or another user's statistics")
		.setDescriptionLocalizations({
			'pt-BR': 'Mostra as suas ou as estatísticas de outro usuário',
			'es-ES': 'Muestra tus o las estadísticas de otro usuario',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('the user you want to get info about, leave blank to get your stats')
				.setDescriptionLocalizations({
					'pt-BR': 'o usuário que você deseja ver as estatísticas, deixe vazio para ver a sua',
					'es-ES': 'el usuario que quieres ver las estadísticas, deja en blanco para ver las tuyas',
				})
				.setRequired(false)
		),
	execute: async ({ guild, member, instance, interaction, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var user = interaction.options.getUser('user');
			const target = user ? await guild.members.fetch(user.id) : member;
			const player = await database.player.findOne(target.id);

			const embed = instance
				.createEmbed(target.displayColor)
				.setTitle(instance.getMessage(interaction, 'STATS_TITLE', { USER: target.displayName }))
				.addFields(
					{
						name: ':arrow_up: Rankups',
						value: `${format(player.rank - 1)} rankups`,
						inline: true,
					},
					{
						name: `:pager: ${instance.getMessage(interaction, 'STATS_TOTAL_COMMANDS')}`,
						value: `${format(player.stats.commands)} ${instance.getMessage(interaction, 'STATS_COMMANDS')}`,
						inline: true,
					},
					{
						name: `:mag: ${instance.getMessage(interaction, 'STATS_ITEMS_FOUND')}`,
						value: `${format(player.stats.itemsFound)} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					},
					{
						name: `:briefcase: ${instance.getMessage(interaction, 'STATS_WORK')}`,
						value: `${format(player.stats.timesWorked)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:compass: ${instance.getMessage(interaction, 'STATS_EXPLORE')}`,
						value: `${format(player.stats.timesExplored)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:fishing_pole_and_fish: ${instance.getMessage(interaction, 'STATS_FISH')}`,
						value: `${format(player.stats.timesFished)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:ox: ${instance.getMessage(interaction, 'STATS_HUNT')}`,
						value: `${format(player.stats.timesHunted)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:pick: ${instance.getMessage(interaction, 'STATS_MINE')}`,
						value: `${format(player.stats.timesMined)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:gift: ${instance.getMessage(interaction, 'STATS_VOTE')}`,
						value: `${format(player.stats.timesVoted)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:hammer_pick: ${instance.getMessage(interaction, 'STATS_CRAFTS')}`,
						value: `${format(player.stats.itemsCrafted)} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					},
					{
						name: `:tickets: ${instance.getMessage(interaction, 'STATS_LOTTERY')}`,
						value: `${format(player.stats.lotteryWins)} falcoins`,
						inline: true,
					},
					{
						name: `:confetti_ball: ${instance.getMessage(interaction, 'STATS_SCRATCH')}`,
						value: `${format(player.stats.scratchJackpots)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:droplet: ${instance.getMessage(interaction, 'STATS_WATERED')}`,
						value: `${format(player.stats.timesWatered)} ${instance.getMessage(interaction, 'STATS_TIMES')}`,
						inline: true,
					},
					{
						name: `:seedling: ${instance.getMessage(interaction, 'STATS_HARVESTED')}`,
						value: `${format(player.stats.cropsHarvested)} ${instance.getMessage(interaction, 'STATS_CROPS')}`,
						inline: true,
					},
					{
						name: `:shopping_cart: ${instance.getMessage(interaction, 'STATS_SOLD')}`,
						value: `${format(player.stats.listingsSold)} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					},
					{
						name: `:snowflake: ${instance.getMessage(interaction, 'STATS_MYTHICAL')}`,
						value: `${format(player.stats.mythicalUsed)} ${instance.getMessage(interaction, 'STATS_ITEMS')}`,
						inline: true,
					}
				);

			await instance.editReply(interaction, {
				embeds: [embed],
			});
		} catch (error) {
			console.error(`stats: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
