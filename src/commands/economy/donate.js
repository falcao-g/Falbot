const { specialArg, readFile, format, changeDB } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setNameLocalizations({
			'pt-BR': 'doar',
			'es-ES': 'donar',
		})
		.setDescription('Donate x falcoins to a user')
		.setDescriptionLocalizations({
			'pt-BR': 'Doe x falcoins para outro usuário',
			'es-ES': 'Dona x falcoins a otro usuario',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('user to donate to')
				.setDescriptionLocalizations({
					'pt-BR': 'quem vai receber a doação',
					'es-ES': 'quien va a recibir la donación',
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to donate (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalizations({
					'pt-BR': 'a quantidade de falcoins para doar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'la cantidad de falcoins para donar (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, user, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			var target = interaction.options.getUser('user');
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
				await changeDB(user.id, 'falcoins', -quantity);
				await changeDB(target.id, 'falcoins', quantity);
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'DOAR', {
						FALCOINS: format(quantity),
						USER: target,
					}),
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
					ephemeral: true,
				});
			}
		} catch (error) {
			console.error(`donation: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
