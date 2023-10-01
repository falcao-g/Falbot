const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setNameLocalization('pt-BR', 'canal')
		.setDescription('Configure disabled channels in your server, Falbot will not work in these channels')
		.setDescriptionLocalization(
			'pt-BR',
			'Configure canais desabilitados no seu servidor, o Falbot não irá responder nesses canais'
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('disable')
				.setNameLocalization('pt-BR', 'desativar')
				.setDescription('Falbot will not send messages in the selected channel')
				.setDescriptionLocalization('pt-BR', 'Falbot não irá mandar mensagens no canal escolhido')
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setNameLocalization('pt-BR', 'canal')
						.setDescription('channel to be deactivated')
						.setDescriptionLocalization('pt-BR', 'canal para ser desativado')
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('enable')
				.setNameLocalization('pt-BR', 'reativar')
				.setDescription('Falbot will return sending messages in the channel')
				.setDescriptionLocalization('pt-BR', 'Falbot voltará à mandar mensagens no canal escolhido')
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setNameLocalization('pt-BR', 'canal')
						.setDescription('channel to be deactivated')
						.setDescriptionLocalization('pt-BR', 'canal para ser reativado')
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
