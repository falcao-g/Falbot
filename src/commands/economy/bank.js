const { SlashCommandBuilder } = require('discord.js');
const { format } = require('../../utils/functions.js');
const { numerize } = require('numerize');

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
	execute: async ({ user, member, interaction, instance, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const subcommand = interaction.options.getSubcommand();
			const falcoins = interaction.options.getString('falcoins');
			const player = await database.player.findOne(user.id);
			const limit = instance.levels[player.rank - 1].bankLimit;

			if (subcommand === 'view') {
				const embed = instance.createEmbed(member.displayColor).addFields({
					name: ':bank: ' + instance.getMessage(interaction, 'BANK'),
					value: `**:coin: ${format(player.bank)} falcoins\n:bank: ${instance.getMessage(
						interaction,
						'BANK_INTEREST'
					)}\n\n:money_with_wings: ${format(limit - player.bank)} ${instance.getMessage(
						interaction,
						'BANK_LIMIT'
					)}\n:atm: ${instance.getMessage(interaction, 'BANK_DEPOSIT_LIMIT', {
						FALCOINS: format(limit / 2),
					})}**`,
				});
				await instance.editReply(interaction, { embeds: [embed] });
			} else if (subcommand === 'deposit') {
				try {
					var quantity = numerize(falcoins, player.falcoins);
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: falcoins,
						}),
					});
					return;
				}

				if (player.falcoins >= quantity) {
					if (player.bank >= limit / 2) {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'BANK_OVER_LIMIT'),
						});
						return;
					}

					if (quantity + player.bank > limit / 2) {
						quantity = limit / 2 - player.bank;
					}

					player.falcoins -= quantity;
					player.bank += quantity;

					const embed = instance
						.createEmbed(member.displayColor)
						.setTitle(
							instance.getMessage(interaction, 'BANK_DEPOSIT', {
								VALUE: format(quantity),
							})
						)
						.addFields(
							{
								name: instance.getMessage(interaction, 'BALANCE'),
								value: `${format(player.falcoins)} falcoins`,
							},
							{
								name: instance.getMessage(interaction, 'BANK'),
								value: instance.getMessage(interaction, 'BANK_BALANCE', {
									VALUE: format(player.bank),
								}),
							}
						);

					await instance.editReply(interaction, { embeds: [embed] });
				} else {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
					});
				}
			} else if (subcommand === 'withdraw') {
				try {
					var quantity = numerize(falcoins, player.bank);
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: falcoins,
						}),
					});
					return;
				}

				if (player.bank >= quantity) {
					player.bank -= quantity;
					player.falcoins += quantity;

					const embed = instance
						.createEmbed(member.displayColor)
						.setTitle(
							instance.getMessage(interaction, 'BANK_WITHDRAW', {
								VALUE: format(quantity),
							})
						)
						.addFields(
							{
								name: instance.getMessage(interaction, 'BALANCE'),
								value: `${format(player.falcoins)} falcoins`,
							},
							{
								name: instance.getMessage(interaction, 'BANK'),
								value: instance.getMessage(interaction, 'BANK_BALANCE', {
									VALUE: format(player.bank),
								}),
							}
						);

					await instance.editReply(interaction, { embeds: [embed] });
				} else {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BANK_INSUFFICIENT'),
					});
				}
			}
			player.save();
		} catch (error) {
			console.error(`bank: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
