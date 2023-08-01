const { SlashCommandBuilder } = require('discord.js');
const { specialArg, readFile, format, getRoleColor, changeDB } = require('../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bank')
		.setNameLocalization('pt-BR', 'banco')
		.setDescription('Deposit or withdraw your falcoins from the bank, falcoins in the bank increases daily')
		.setDescriptionLocalization('pt-BR', 'Deposite ou saque falcoins do banco, falcoins no banco aumenta diariamente')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('deposit')
				.setNameLocalization('pt-BR', 'depositar')
				.setDescription('Deposit falcoins to the bank')
				.setDescriptionLocalization('pt-BR', 'Deposite falcoins no banco')
				.addStringOption((option) =>
					option
						.setName('falcoins')
						.setDescription(
							'the amount of falcoins to deposit (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalization(
							'pt-BR',
							'a quantidade de falcoins para depositar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('withdraw')
				.setNameLocalization('pt-BR', 'sacar')
				.setDescription('Withdraw falcoins to the bank')
				.setDescriptionLocalization('pt-BR', 'Saque falcoins do banco')
				.addStringOption((option) =>
					option
						.setName('falcoins')
						.setDescription(
							'the amount of falcoins to withdraw (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalization(
							'pt-BR',
							'a quantidade de falcoins para sacar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalization('pt-BR', 'ver')
				.setDescription('View bank balance and other useful stats')
				.setDescriptionLocalization('pt-BR', 'Veja o saldo bancário e outras informações')
		),
	execute: async ({ user, member, interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const subcommand = interaction.options.getSubcommand();
			const falcoins = interaction.options.getString('falcoins');
			const rank = await readFile(user.id, 'rank');
			const limit = instance.levels[rank - 1].bankLimit;

			if (subcommand === 'view') {
				const embed = instance.createEmbed(member.displayColor).addFields({
					name: ':bank: ' + instance.getMessage(interaction, 'BANCO'),
					value: `**:coin: ${await readFile(user.id, 'banco', true)} falcoins\n:bank: ${instance.getMessage(
						interaction,
						'BANK_INTEREST'
					)}\n\n:money_with_wings: ${format(limit - (await readFile(user.id, 'banco')))} ${instance.getMessage(
						interaction,
						'BANK_LIMIT'
					)}\n:atm: ${instance.getMessage(interaction, 'BANK_DEPOSIT_LIMIT', {
						FALCOINS: format(limit / 2),
					})}**`,
				});
				await interaction.editReply({ embeds: [embed] });
			} else if (subcommand === 'deposit') {
				try {
					var quantity = await specialArg(falcoins, user.id, 'falcoins');
				} catch {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: falcoins,
						}),
					});
					return;
				}

				if ((await readFile(user.id, 'falcoins')) >= quantity) {
					if ((await readFile(user.id, 'banco')) >= limit / 2) {
						await interaction.editReply({
							content: instance.getMessage(interaction, 'BANK_OVER_LIMIT'),
						});
						return;
					}

					if (quantity + (await readFile(user.id, 'banco')) > limit / 2) {
						quantity = limit / 2 - (await readFile(user.id, 'banco'));
					}

					await changeDB(user.id, 'falcoins', -quantity);
					await changeDB(user.id, 'banco', quantity);

					const embed = instance
						.createEmbed(member.displayColor)
						.setTitle(
							instance.getMessage(interaction, 'BANCO_DEPOSITOU', {
								VALUE: format(quantity),
							})
						)
						.addFields(
							{
								name: instance.getMessage(interaction, 'SALDO_ATUAL'),
								value: `${await readFile(user.id, 'falcoins', true)} falcoins`,
							},
							{
								name: instance.getMessage(interaction, 'BANCO'),
								value: instance.getMessage(interaction, 'BANCO_SALDO', {
									VALUE: await readFile(user.id, 'banco', true),
								}),
							}
						);

					await interaction.editReply({ embeds: [embed] });
				} else {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
					});
				}
			} else if (subcommand === 'withdraw') {
				try {
					var quantity = await specialArg(falcoins, user.id, 'banco');
				} catch {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: falcoins,
						}),
					});
					return;
				}

				if ((await readFile(user.id, 'banco')) >= quantity) {
					await changeDB(user.id, 'banco', -quantity);
					await changeDB(user.id, 'falcoins', quantity);

					const embed = instance
						.createEmbed(member.displayColor)
						.setTitle(
							instance.getMessage(interaction, 'BANCO_SACOU', {
								VALUE: format(quantity),
							})
						)
						.addFields(
							{
								name: instance.getMessage(interaction, 'SALDO_ATUAL'),
								value: `${await readFile(user.id, 'falcoins', true)} falcoins`,
							},
							{
								name: instance.getMessage(interaction, 'BANCO'),
								value: instance.getMessage(interaction, 'BANCO_SALDO', {
									VALUE: await readFile(user.id, 'banco', true),
								}),
							}
						);

					await interaction.editReply({ embeds: [embed] });
				} else {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'BANCO_INSUFICIENTE'),
					});
				}
			}
		} catch (error) {
			console.error(`bank: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
