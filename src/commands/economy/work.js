const { randint, format, isEquipped, useItem } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('work')
		.setNameLocalizations({
			'pt-BR': 'trabalhar',
			'es-ES': 'trabajar',
		})
		.setDescription('Go to work to earn falcoins')
		.setDescriptionLocalizations({
			'pt-BR': 'Vá trabalhar para ganhar falcoins',
			'es-ES': 'Ve a trabajar para ganar falcoins',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance, member, user, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			var levels = instance.levels;
			const player = await database.player.findOne(user.id);

			var min = levels[player.rank - 1].work[0];
			var max = levels[player.rank - 1].work[1];
			var salary = randint(min, max);
			var eventText = '';

			if (await isEquipped(member, 'coffee')) {
				salary *= 2;
				await useItem(member, 'coffee');
				eventText += `\n${instance.getMessage(interaction, 'WORK_BUFF')}`;
			}

			if (instance.activeEvents.has('Overtime')) {
				salary *= 3;
				eventText += `\n${instance.getMessage(interaction, 'OVERTIME_BONUS')}`;
			}

			let bonus = 0;
			desc = instance.getMessage(interaction, 'WORK_GAINS', {
				FALCOINS: format(salary),
			});
			luck = randint(0, 100);

			if (luck <= 30) {
				bonus = salary * 2;
				desc +=
					'\n' +
					instance.getMessage(interaction, 'BONUS', {
						FALCOINS: format(bonus),
					});
			}

			player.falcoins += salary + bonus;

			var embed = instance
				.createEmbed(member.displayColor)
				.setTitle(
					instance.getMessage(interaction, 'WORK_TITLE', {
						FALCOINS: format(salary + bonus),
					})
				)
				.setDescription(desc + eventText);

			await instance.editReply(interaction, {
				embeds: [embed],
			});

			player.stats.set('timesWorked', player.stats.get('timesWorked') + 1);
			player.save();
		} catch (err) {
			console.error(`work: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
