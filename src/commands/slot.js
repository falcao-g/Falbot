const { specialArg, readFile, changeDB, getRoleColor, format, pick } = require('../utils/functions.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slot')
		.setNameLocalization('pt-BR', 'níquel')
		.setDescription('Bet your falcoins in the slot machine')
		.setDescriptionLocalization('pt-BR', 'Aposte falcoins no caça-níquel')
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
	execute: async ({ guild, interaction, instance, user }) => {
		try {
			await interaction.deferReply();
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
				const choices = [
					[':money_mouth:', 30],
					[':gem:', 10],
					[':moneybag:', 15],
					[':coin:', 25],
					[':dollar:', 20],
				];
				const emote = instance.emojiList['niquel'];
				const emoji1 = pick(choices);
				const emoji2 = pick(choices);
				const emoji3 = pick(choices);

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: `-------------------\n | ${emote} | ${emote} | ${emote} |\n-------------------`,
						value: `--- **${instance.getMessage(interaction, 'GIRANDO')}** ---`,
					})
					.setFooter({ text: 'by Falcão ❤️' });

				await interaction.editReply({
					embeds: [embed],
				});

				await new Promise((resolve) => setTimeout(resolve, 1500));
				(embed.data.fields[0].name = `-------------------\n | ${emoji1} | ${emote} | ${emote} |\n-------------------`),
					await interaction.editReply({ embeds: [embed] });
				await new Promise((resolve) => setTimeout(resolve, 1500));
				(embed.data.fields[0].name = `-------------------\n | ${emoji1} | ${emoji2} | ${emote} |\n-------------------`),
					await interaction.editReply({ embeds: [embed] });
				await new Promise((resolve) => setTimeout(resolve, 1500));
				(embed.data.fields[0].name = `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`),
					await interaction.editReply({ embeds: [embed] });

				const arrayEmojis = [emoji1, emoji2, emoji3];
				var dollar = arrayEmojis.filter((emoji) => emoji == ':dollar:').length;
				var coin = arrayEmojis.filter((emoji) => emoji == ':coin:').length;
				var moneybag = arrayEmojis.filter((emoji) => emoji == ':moneybag:').length;
				var gem = arrayEmojis.filter((emoji) => emoji == ':gem:').length;
				var money_mouth = arrayEmojis.filter((emoji) => emoji == ':money_mouth:').length;

				if (dollar == 3 || moneybag == 2) {
					var winnings = 3;
				} else if (coin == 3 || money_mouth == 3) {
					var winnings = 2.5;
				} else if (moneybag == 3) {
					var winnings = 7;
				} else if (gem == 3) {
					var winnings = 10;
				} else if (dollar == 2 || coin == 2) {
					var winnings = 2;
				} else if (gem == 2) {
					var winnings = 5;
				} else if (money_mouth == 2) {
					var winnings = 0.5;
				}
				var profit = parseInt(bet * winnings);

				if (profit > 0) {
					await changeDB(user.id, 'falcoins', profit);
					var embed2 = new EmbedBuilder().setColor(3066993).addFields(
						{
							name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
							value: `--- **${instance.getMessage(interaction, 'VOCE_GANHOU')}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(interaction, 'GANHOS'),
							value: `${format(profit)} falcoins`,
							inline: true,
						}
					);
				} else {
					var embed2 = new EmbedBuilder().setColor(15158332).addFields(
						{
							name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
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
				embed2
					.addFields({
						name: instance.getMessage(interaction, 'SALDO_ATUAL'),
						value: `${await readFile(user.id, 'falcoins', true)}`,
					})
					.setFooter({ text: 'by Falcão ❤️' });
				await interaction.editReply({
					embeds: [embed2],
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
				});
			}
		} catch (error) {
			console.error(`slot: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
