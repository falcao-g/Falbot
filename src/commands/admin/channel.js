const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setNameLocalizations({
			'pt-BR': 'canal',
			'es-ES': 'canal',
		})
		.setDescription('Configure disabled channels in your server, Falbot will not work in these channels')
		.setDescriptionLocalizations({
			'pt-BR': 'Configure canais desabilitados no seu servidor, o Falbot não irá responder nesses canais',
			'es-ES': 'Configura los canales deshabilitados en su servidor, Falbot no funcionará en estos canales',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('disable')
				.setNameLocalizations({
					'pt-BR': 'desativar',
					'es-ES': 'desactivar',
				})
				.setDescription('Falbot will not send messages in the selected channel')
				.setDescriptionLocalizations({
					'pt-BR': 'Falbot não irá mandar mensagens no canal escolhido',
					'es-ES': 'Falbot no enviará mensajes en el canal seleccionado',
				})
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setNameLocalizations({
							'pt-BR': 'canal',
							'es-ES': 'canal',
						})
						.setDescription('channel to be deactivated')
						.setDescriptionLocalizations({
							'pt-BR': 'canal para ser desativado',
							'es-ES': 'canal para ser desactivado',
						})
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('enable')
				.setNameLocalizations({
					'pt-BR': 'reativar',
					'es-ES': 'reactivar',
				})
				.setDescription('Falbot will return sending messages in the channel')
				.setDescriptionLocalizations({
					'pt-BR': 'Falbot voltará à mandar mensagens no canal escolhido',
					'es-ES': 'Falbot volverá a enviar mensajes en el canal seleccionado',
				})
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setNameLocalizations({
							'pt-BR': 'canal',
							'es-ES': 'canal',
						})
						.setDescription('channel to be deactivated')
						.setDescriptionLocalizations({
							'pt-BR': 'canal para ser reativado',
							'es-ES': 'canal para ser reactivado',
						})
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		),
	execute: async ({ guild, interaction, instance }) => {
		await interaction.deferReply({ ephemeral: true }).catch(() => {});
		try {
			const subcommand = interaction.options.getSubcommand();
			const channel = interaction.options.getChannel('channel');

			if (subcommand === 'disable') {
				instance.disableChannel(guild, channel);

				await instance.guildsSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						$push: { disabledChannels: channel.id },
					},
					{
						upsert: true,
					}
				);
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'DISABLED', { NAME: channel }),
				});
			} else {
				instance.enableChannel(guild, channel);

				await instance.guildsSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						$pull: { disabledChannels: channel.id },
					},
					{
						upsert: true,
					}
				);
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'ENABLED', { NAME: channel }),
				});
			}
		} catch (error) {
			console.error(`channel: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
