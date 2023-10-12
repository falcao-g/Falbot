const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { loadCommands } = require('../../handlers/commandHandler');
const { loadEvents } = require('../../handlers/eventHandler');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName('tools')
		.setDescription('Tools for Falbot developers')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('ban')
				.setDescription('ban an user')
				.addStringOption((option) => option.setName('user').setDescription('user to be banned').setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('unban')
				.setDescription('unban an user')
				.addStringOption((option) => option.setName('user').setDescription('user to be unbanned').setRequired(true))
		)
		.addSubcommand((subcommand) => subcommand.setName('reload_events').setDescription('reload your events'))
		.addSubcommand((subcommand) => subcommand.setName('reload_commands').setDescription('reload your commands')),
	execute: async ({ interaction, instance, client }) => {
		await interaction.deferReply({ ephemeral: true }).catch(() => {});
		try {
			subcommand = interaction.options.getSubcommand();
			const userId = interaction.options.getString('user');
			if (subcommand === 'ban') {
				instance.ban(userId);

				await instance.bannedSchema.findOneAndUpdate(
					{
						_id: userId,
					},
					{
						_id: userId,
					},
					{
						upsert: true,
					}
				);

				instance.editReply(interaction, {
					content: `User ${userId} was banned sucessfully`,
				});
			} else if (subcommand === 'unban') {
				instance.unban(userId);

				await instance.bannedSchema.deleteOne({
					_id: userId,
				});

				instance.editReply(interaction, {
					content: `User ${userId} was unbanned sucessfully`,
				});
			} else if (subcommand === 'reload_events') {
				for (const [key, value] of client.events) {
					client.removeListener(`${key}`, value, true);
				}
				loadEvents(instance, client);
				instance.editReply(interaction, {
					content: 'Events reloaded',
				});
			} else {
				loadCommands(instance, client);
				instance.editReply(interaction, {
					content: 'Commands reloaded',
				});
			}
		} catch (error) {
			console.error(`tools: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
