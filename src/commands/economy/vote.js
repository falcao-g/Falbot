const { changeDB, readFile, msToTime, format } = require('../../utils/functions.js');
require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setNameLocalizations({
			'pt-BR': 'voto',
			'es-ES': 'voto',
		})
		.setDescription('Earn falcoins by voting for us on top.gg')
		.setDescriptionLocalizations({
			'pt-BR': 'Ganhe falcois votando no bot no top.gg',
			'es-ES': 'Gana falcoins votando por nosotros en top.gg',
		}),
	execute: async ({ user, instance, interaction }) => {
		try {
			await interaction.deferReply().catch(() => {});

			var request = await fetch(`https://top.gg/api/bots/check?userId=${user.id}`, {
				method: 'GET',
				headers: {
					Authorization: process.env.Authorization,
				},
			});

			var voted = (await request.json()).voted;
			var rank_number = await readFile(user.id, 'rank');
			var reward = instance.levels[rank_number - 1].vote;
			lastVote = await readFile(user.id, 'lastVote');

			if (Date.now() - lastVote > 1000 * 60 * 60 * 48) {
				await changeDB(user.id, 'voteStreak', 0, true);
			}

			if (voted && Date.now() - lastVote > 1000 * 60 * 60 * 12) {
				const bonus = Math.min(await readFile(user.id, 'voteStreak'), 30) * 5;
				await changeDB(user.id, 'lastVote', Date.now(), true);
				await changeDB(user.id, 'voteStreak', 1);
				await changeDB(user.id, 'falcoins', reward + (reward * bonus) / 100);
				var embed = instance.createEmbed(3066993).addFields({
					name: instance.getMessage(interaction, 'VOTE_THANKS'),
					value:
						bonus != 150
							? instance.getMessage(interaction, 'VOTE_COLLECTED', {
									REWARD: format(reward),
									PERCENTAGE: bonus,
							  })
							: instance.getMessage(interaction, 'VOTE_COLLECTED_MAX', {
									REWARD: format(reward),
									PERCENTAGE: bonus,
							  }),
				});
				var stats = await readFile(interaction.user.id, 'stats');
				stats.set('timesVoted', stats.get('timesVoted') + 1);
				await changeDB(interaction.user.id, 'stats', stats, true);
			} else if (voted && Date.now() - lastVote < 1000 * 60 * 60 * 12) {
				var embed = instance.createEmbed(15158332).addFields({
					name: instance.getMessage(interaction, 'ALREADY_COLLECTED'),
					value: instance.getMessage(interaction, 'ALREADY_COLLECTED2', {
						TIME: msToTime(1000 * 60 * 60 * 12 - (Date.now() - lastVote)),
						REWARD: format(reward),
					}),
				});
			} else {
				var embed = instance
					.createEmbed('#0099ff')
					.addFields({
						name: instance.getMessage(interaction, 'VOTE_FIRST'),
						value: instance.getMessage(interaction, 'VOTE_DESCRIPTION', {
							FALCOINS: format(reward),
						}),
					})
					.addFields({
						name: instance.getMessage(interaction, 'VOTE_HERE'),
						value:
							'https://top.gg/bot/742331813539872798/vote\n\n' +
							instance.getMessage(interaction, 'VOTE_FINAL', {
								PERCENTAGE: (await readFile(user.id, 'voteStreak')) * 5,
							}),
					});
			}
			await instance.editReply(interaction, { embeds: [embed] });
		} catch (error) {
			console.error(`vote: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
