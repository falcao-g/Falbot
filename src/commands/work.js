const { readFile, changeDB, randint, format } = require('../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('work')
		.setNameLocalization('pt-BR', 'trabalhar')
		.setDescription('Go to work to earn falcoins')
		.setDescriptionLocalization('pt-BR', 'Vá trabalhar para ganhar falcoins')
		.setDMPermission(false),
	execute: async ({ interaction, instance, member, user }) => {
		try {
			await interaction.deferReply().catch(() => {});
			var levels = instance.levels;

			var rank_number = await readFile(user.id, 'rank');
			var min = levels[rank_number - 1].work[0];
			var max = levels[rank_number - 1].work[1];
			var salary = randint(min, max);

			let bonus = 0;
			desc = instance.getMessage(interaction, 'WORK', {
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

			if (instance.activeEvents.has('Overtime')) {
				salary *= 3;
				desc += `\n${instance.getMessage(interaction, 'OVERTIME_BONUS')}`;
			}

			changeDB(user.id, 'falcoins', salary + bonus);

			var embed = instance
				.createEmbed(member.displayColor)
				.setTitle(
					instance.getMessage(interaction, 'WORK_TITLE', {
						FALCOINS: format(salary + bonus),
					})
				)
				.setDescription(desc);

			await interaction.editReply({
				embeds: [embed],
			});

			var stats = await readFile(interaction.user.id, 'stats');
			stats.set('timesWorked', stats.get('timesWorked') + 1);
			await changeDB(interaction.user.id, 'stats', stats, true);
		} catch (err) {
			console.error(`work: ${err}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
