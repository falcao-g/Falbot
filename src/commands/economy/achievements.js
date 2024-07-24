const { paginate, buttons } = require('../../utils/functions.js');
const { SlashCommandBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setNameLocalizations({
			'pt-BR': 'conquistas',
			'es-ES': 'logros',
		})
		.setDescription('View your achievements')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('list')
				.setNameLocalizations({
					'pt-BR': 'listar',
					'es-ES': 'listar',
				})
				.setDescription('List all achievements')
				.setDescriptionLocalizations({
					'pt-BR': 'Listar todas as conquistas',
					'es-ES': 'Listar todos los logros',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('refresh')
				.setNameLocalizations({
					'pt-BR': 'atualizar',
					'es-ES': 'actualizar',
				})
				.setDescription('Scan for new achievements you may have unlocked')
				.setDescriptionLocalizations({
					'pt-BR': 'Verificar novas conquistas que você pode ter desbloqueado',
					'es-ES': 'Buscar nuevos logros que puedas haber desbloqueado',
				})
		),
	execute: async ({ interaction, instance, member, subcommand, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var type = interaction.options.getSubcommand();
		} catch {
			var type = subcommand;
		}

		if (type === 'list') {
			const user = await database.player.findOne(member.id);
			const createList = (user, page, itemsPerPage = 7) => {
				const achievements = Array.from(instance.achievement.all().values()).splice(page * itemsPerPage, itemsPerPage);

				let returnValue = '';
				for (const achievement of achievements) {
					const progress = achievement.progress(user);
					const name = user.badges.includes(achievement.id)
						? `~~${achievement.name[interaction.locale]}~~`
						: achievement.name[interaction.locale];
					returnValue += `${achievement.emoji} **${name}**${
						progress ? ` (${progress})` : ''
					}\n> ${achievement.description[interaction.locale]}\n\n`;
				}

				return returnValue.trim();
			};

			const embeds = [];
			let page = 0;
			const total = Math.ceil(instance.achievement.all().size / 7);
			let achievements = createList(user, page);
			while (achievements) {
				const embed = instance
					.createEmbed(member.displayColor)
					.setTitle(instance.getMessage(interaction, 'ACHIEVEMENTS', { PAGE: page + 1, TOTAL: total }))
					.setDescription(achievements);
				embeds.push(embed);
				page++;
				achievements = createList(user, page);
			}

			const paginator = paginate();
			paginator.add(...embeds);
			const ids = [`${Date.now()}__left`, `${Date.now()}__right`];
			paginator.setTraverser([
				new ButtonBuilder().setEmoji('⬅️').setCustomId(ids[0]).setStyle('Secondary'),
				new ButtonBuilder().setEmoji('➡️').setCustomId(ids[1]).setStyle('Secondary'),
				new ButtonBuilder().setCustomId('achievements refresh').setEmoji('🔄').setStyle('Secondary'),
			]);
			const message = await instance.editReply(interaction, paginator.components());
			message.channel.createMessageComponentCollector().on('collect', async (i) => {
				if (i.customId === ids[0]) {
					await paginator.back();
					await i.update(paginator.components());
				} else if (i.customId === ids[1]) {
					await paginator.next();
					await i.update(paginator.components());
				}
			});
		} else if (type === 'refresh') {
			const user = await database.player.findOne(member.id);
			const achievements = Array.from(instance.achievement.all().values()).filter(
				(achievement) => !user.badges.includes(achievement.id) && achievement.hasAchieved(user)
			);

			if (!achievements.length) {
				await instance.editReply(interaction, { content: instance.getMessage(interaction, 'NO_NEW_ACHIEVEMENTS') });
				return;
			}

			await instance.userSchema.findByIdAndUpdate(member.id, {
				$push: { badges: { $each: achievements.map((achievement) => achievement.id) } },
			});

			const embed = instance
				.createEmbed(member.displayColor)
				.setTitle(instance.getMessage(interaction, 'NEW_ACHIEVEMENTS'))
				.setDescription(
					achievements
						.map((achievement) => `${achievement.emoji} **${achievement.name[interaction.locale]}**`)
						.join('\n')
				);
			await instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['list_achievements'])],
			});
		}
	},
};
