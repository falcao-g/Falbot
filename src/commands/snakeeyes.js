const { specialArg, readFile, changeDB, format, randint } = require('../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snakeeyes')
		.setNameLocalization('pt-BR', 'olhoscobra')
		.setDescription('Roll two dice, if either of them roll a one, you win')
		.setDescriptionLocalization('pt-BR', 'Role dois dados, se algum dos dois der 1, você ganha')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ interaction, instance, user, member }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const falcoins = interaction.options.getString('falcoins');

			try {
				var bet = await specialArg(falcoins, user.id, 'falcoins');
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
				return;
			}

			if ((await readFile(user.id, 'falcoins')) >= bet) {
				await changeDB(user.id, 'falcoins', -bet);
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

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: `-------------------\n      | ${diegif} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLANDO')}** ---`,
				});

				await interaction.editReply({
					embeds: [embed],
				});

				await new Promise((resolve) => setTimeout(resolve, 1500));
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLANDO')}** ---`,
				};
				await interaction.editReply({ embeds: [embed] });
				await new Promise((resolve) => setTimeout(resolve, 1500));
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
					value: `--- **${instance.getMessage(interaction, 'ROLANDO')}** ---`,
				};
				await interaction.editReply({ embeds: [embed] });

				if (random1 === 1 && random2 === 1) {
					await changeDB(user.id, 'falcoins', bet * 5);
					var embed2 = instance.createEmbed('#F1C40F').addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'VOCE_GANHOU')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'GANHOS'),
							value: `${format(bet * 5)} falcoins`,
							inline: true,
						}
					);
				} else if (random1 === 1 || random2 === 1) {
					await changeDB(user.id, 'falcoins', bet * 2);
					var embed2 = instance.createEmbed(3066993).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'VOCE_GANHOU')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'GANHOS'),
							value: `${format(bet * 2)} falcoins`,
							inline: true,
						}
					);
				} else {
					var embed2 = instance.createEmbed(15158332).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'VOCE_PERDEU')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'PERDAS'),
							value: `${format(bet)} falcoins`,
							inline: true,
						}
					);
				}
				embed2.addFields({
					name: instance.getMessage(interaction, 'SALDO_ATUAL'),
					value: `${await readFile(user.id, 'falcoins', true)}`,
				});
				await interaction.editReply({
					embeds: [embed2],
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
				});
			}
		} catch (error) {
			console.error(`snakeeyes: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
