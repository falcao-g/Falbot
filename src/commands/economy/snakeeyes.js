const { format, randint } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');
const { numerize } = require('numerize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snakeeyes')
		.setNameLocalizations({
			'pt-BR': 'olhoscobra',
			'es-ES': 'olhoscobra',
		})
		.setDescription('Roll two dice, if either of them roll a one, you win')
		.setDescriptionLocalizations({
			'pt-BR': 'Role dois dados, se algum dos dois der 1, você ganha',
			'es-ES': 'Tira dos dados, si alguno de ellos da 1, ganas',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalizations({
					'pt-BR': 'quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'cantidad de falcoins para apostar (soporta "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, instance, user, member, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const falcoins = interaction.options.getString('falcoins');
			const player = await database.player.findOne(user.id);

			try {
				var bet = await numerize(falcoins, player.falcoins);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: falcoins,
					}),
				});
				return;
			}

			if (player.falcoins >= bet) {
				player.falcoins -= bet;
				const diegif = instance.emojiList['dadogif'];
				const choices = [
					instance.emojiList['dado1'],
					instance.emojiList['dado2'],
					instance.emojiList['dado3'],
					instance.emojiList['dado4'],
					instance.emojiList['dado5'],
					instance.emojiList['dado6'],
				];
				random1 = randint(1, 6);
				random2 = randint(1, 6);
				emoji1 = choices[random1 - 1];
				emoji2 = choices[random2 - 1];

				const embed = instance.createEmbed(await instance.getUserDisplay('displayColor', member)).addFields({
					name: `-------------------\n      | ${diegif} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLLING')}** ---`,
				});

				await instance.editReply(interaction, {
					embeds: [embed],
				});

				await new Promise((resolve) => setTimeout(resolve, 1500));
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLLING')}** ---`,
				};
				await instance.editReply(interaction, { embeds: [embed] });
				await new Promise((resolve) => setTimeout(resolve, 1500));
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLLING')}** ---`,
				};
				await instance.editReply(interaction, { embeds: [embed] });

				if (random1 === 1 && random2 === 1) {
					player.falcoins += bet * 5;
					var embed2 = instance.createEmbed('#F1C40F').addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'YOU_WON')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'WINNINGS'),
							value: `${format(bet * 5)} falcoins`,
							inline: true,
						}
					);
				} else if (random1 === 1 || random2 === 1) {
					player.falcoins += bet * 2;
					var embed2 = instance.createEmbed(3066993).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'YOU_WON')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'WINNINGS'),
							value: `${format(bet * 2)} falcoins`,
							inline: true,
						}
					);
				} else {
					var embed2 = instance.createEmbed(15158332).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'YOU_LOST')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'LOSSES'),
							value: `${format(bet)} falcoins`,
							inline: true,
						}
					);
				}
				embed2.addFields({
					name: instance.getMessage(interaction, 'BALANCE'),
					value: `${format(player.falcoins)}`,
				});
				await instance.editReply(interaction, {
					embeds: [embed2],
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
			}
			player.save();
		} catch (error) {
			console.error(`snakeeyes: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
