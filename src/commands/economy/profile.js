const { SlashCommandBuilder, time } = require('discord.js');
const { format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setNameLocalizations({
			'pt-BR': 'perfil',
			'es-ES': 'perfil',
		})
		.setDescription("Shows your or another user's profile")
		.setDescriptionLocalizations({
			'pt-BR': 'Mostra o seu perfil ou o de outro usuário',
			'es-ES': 'Muestra tu perfil o el de otro usuario',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('the user you want to get info about, leave blank to get your profile')
				.setDescriptionLocalizations({
					'pt-BR': 'o usuário que você deseja ver o perfil, deixe vazio para ver o seu',
					'es-ES': 'el usuario que quieres ver el perfil, deja en blanco para ver el tuyo',
				})
				.setRequired(false)
		),
	execute: async ({ guild, member, instance, interaction, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const user = interaction.options.getUser('user');
			const target = user ? await guild.members.fetch(user.id) : member;
			const { rank, falcoins, wins, bank, inventory, voteStreak, tickets, badges, createdAt } =
				await database.player.findOne(target.user.id);
			const limit = instance.levels[rank - 1].bankLimit;
			const displayColor = await instance.getUserDisplay('displayColor', target);
			const displayName = await instance.getUserDisplay('displayName', target);

			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				var rankText = ':sparkles: ' + instance.getMessage(interaction, 'MAX_RANK2');
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				var rankText = instance.getMessage(interaction, 'BALANCE_RANKUP');
			} else {
				var rankText = instance.getMessage(interaction, 'BALANCE_RANKUP2', {
					FALCOINS: format(instance.levels[rank - 1].falcoinsToLevelUp - falcoins),
				});
			}

			const { inventoryWorth, inventoryQuantity } = instance.getInventoryInfo(inventory);

			const achievementBadges = badges.map((badge) => instance.achievement.getById(badge).emoji).join(' ');

			const embed = instance
				.createEmbed(displayColor)
				.setTitle(instance.getMessage(interaction, 'PROFILE', { USER: displayName }))
				.setThumbnail(target.user.avatarURL())
				.addFields(
					{
						name: 'Rank',
						value: `${instance.getMessage(interaction, rank)}\n${rankText}`,
					},
					{
						name: 'Info',
						value: instance.getMessage(interaction, 'PROFILE_INFOS', {
							FALCOINS: format(falcoins),
							WINS: format(wins),
							BANK: format(bank),
							LIMIT: format(limit),
							TICKETS: format(tickets),
							QUANTITY: format(inventoryQuantity),
							WORTH: format(inventoryWorth),
							STREAK: Math.floor(voteStreak / 2),
							CREATED: time(createdAt, 'd'),
						}),
					},
					{
						name: instance.getMessage(interaction, 'BADGES'),
						value: achievementBadges ? achievementBadges : '\u200b',
					}
				);
			embed.data.fields = achievementBadges ? embed.data.fields : embed.data.fields.slice(0, 2);

			await instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['cooldowns', 'help', 'list_achievements'])],
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
