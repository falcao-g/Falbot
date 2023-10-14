const { SlashCommandBuilder } = require('discord.js');
const { specialArg, readFile, format, changeDB } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bank')
		.setNameLocalizations({
			'pt-BR': 'banco',
			'es-ES': 'banco',
		})
		.setDescription('Deposit or withdraw your falcoins from the bank, falcoins in the bank increases daily')
		.setDescriptionLocalizations({
			'pt-BR': 'Deposite ou saque falcoins do banco, falcoins no banco aumenta diariamente',
			'es-ES': 'Deposite o retire falcoins del banco, falcoins en el banco aumenta diariamente',
		})
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('deposit')
				.setNameLocalizations({
					'pt-BR': 'depositar',
					'es-ES': 'depósito',
				})
				.setDescription('Deposit falcoins to the bank')
				.setDescriptionLocalizations({
					'pt-BR': 'Deposite falcoins no banco',
					'es-ES': 'Deposite falcoins no banco',
				})
				.addStringOption((option) =>
					option
						.setName('falcoins')
						.setDescription(
							'the amount of falcoins to deposit (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalizations({
							'pt-BR':
								'a quantidade de falcoins para depositar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
							'es-ES':
								'la cantidad de falcoins para depositar (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('withdraw')
				.setNameLocalizations({
					'pt-BR': 'sacar',
					'es-ES': 'retirar',
				})
				.setDescription('Withdraw falcoins to the bank')
				.setDescriptionLocalizations({
					'pt-BR': 'Saque falcoins do banco',
					'es-ES': 'Retire falcoins del banco',
				})
				.addStringOption((option) =>
					option
						.setName('falcoins')
						.setDescription(
							'the amount of falcoins to withdraw (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalizations({
							'pt-BR':
								'a quantidade de falcoins para sacar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
							'es-ES':
								'la cantidad de falcoins para retirar (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View bank balance and other useful stats')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja o saldo bancário e outras informações',
					'es-ES': 'Ver el saldo bancario y otras informaciones',
				})
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
				await instance.editReply(interaction, { embeds: [embed] });
			} else if (subcommand === 'deposit') {
				try {
					var quantity = await specialArg(falcoins, user.id, 'falcoins');
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: falcoins,
						}),
					});
					return;
				}

				if ((await readFile(user.id, 'falcoins')) >= quantity) {
					if ((await readFile(user.id, 'banco')) >= limit / 2) {
						await instance.editReply({
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

					await instance.editReply(interaction, { embeds: [embed] });
				} else {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
					});
				}
			} else if (subcommand === 'withdraw') {
				try {
					var quantity = await specialArg(falcoins, user.id, 'banco');
				} catch {
					await instance.editReply(interaction, {
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

					await instance.editReply(interaction, { embeds: [embed] });
				} else {
					await instance.editReply({
						content: instance.getMessage(interaction, 'BANCO_INSUFICIENTE'),
					});
				}
			}
		} catch (error) {
			console.error(`bank: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
