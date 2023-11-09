const { resolveCooldown, msToTime, setCooldown } = require('../utils/functions.js');

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction, instance, client) => {
		if (interaction.user.bot) {
			interaction.reply({
				content: instance.getMessage(interaction, 'YOU_ARE_BOT'),
				ephemeral: true,
			});
			return;
		}

		if (instance._banned.includes(interaction.user.id)) {
			interaction.reply({
				content: instance.getMessage(interaction, 'YOU_ARE_BANNED'),
				ephemeral: true,
			});
			return;
		}

		if (interaction.guild != undefined) {
			var disabledChannels = instance._disabledChannels.get(interaction.guild.id);
			var disabledCommands = instance._disabledCommands.get(interaction.guild.id);
		}

		if (disabledChannels != undefined ? disabledChannels.includes(interaction.channel.id) : false) {
			interaction.reply({
				content: instance.getMessage(interaction, 'THIS_CHANNEL_IS_DISABLED'),
				ephemeral: true,
			});
			return;
		}

		if (
			disabledCommands != undefined
				? disabledCommands.includes(interaction.commandName ?? interaction.customId.split(' ')[0])
				: false
		) {
			interaction.reply({
				content: instance.getMessage(interaction, 'THIS_COMMAND_IS_DISABLED'),
				ephemeral: true,
			});
			return;
		}

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (command.cooldown) {
				cooldown = await resolveCooldown(interaction.user.id, interaction.commandName);
				if (cooldown > 0) {
					await interaction.reply({
						content: instance.getMessage(interaction, 'COOLDOWN', {
							COOLDOWN: msToTime(cooldown),
						}),
						ephemeral: true,
					});
					return;
				} else {
					await setCooldown(interaction.user.id, interaction.commandName, command.cooldown);
				}
			}

			if (command.developer && !instance.config.devs.includes(interaction.user.id)) {
				return interaction.reply({
					content: instance.getMessage(interaction, 'BOT_OWNERS_ONLY'),
					ephemeral: true,
				});
			}

			const player = await instance.database.player.findOne(interaction.user.id);
			player.stats.set('commands', player.stats.get('commands') + 1);
			player.save();

			command.execute({
				interaction,
				instance,
				client,
				member: interaction.member,
				guild: interaction.guild,
				user: interaction.user,
				channel: interaction.channel,
				database: instance.database,
			});
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);
			command.autocomplete({ client, interaction, instance });
		} else if (interaction.isButton()) {
			//all button interactions are like the following: <command> <subcommand> <args>
			//but subcommand and args are optional
			const commandName = interaction.customId.split(' ')[0];
			const command = client.commands.get(commandName);

			if (command == undefined) return;

			try {
				var subcommand = interaction.options.getSubcommand();
			} catch {
				var subcommand = interaction.customId.split(' ')[1];
			}

			if (command.cooldown) {
				cooldown = await resolveCooldown(interaction.user.id, interaction.customId);
				if (cooldown > 0) {
					await interaction.reply({
						content: instance.getMessage(interaction, 'COOLDOWN', {
							COOLDOWN: msToTime(cooldown),
						}),
						ephemeral: true,
					});
					return;
				} else {
					await setCooldown(interaction.user.id, interaction.customId, command.cooldown);
				}
			}

			if (commandName == 'help') interaction.values = [null];

			const player = await instance.database.player.findOne(interaction.user.id);
			player.stats.set('commands', player.stats.get('commands') + 1);
			player.save();

			await command.execute({
				interaction,
				instance,
				client,
				member: interaction.member,
				guild: interaction.guild,
				user: interaction.user,
				channel: interaction.channel,
				database: instance.database,
				subcommand,
				args: interaction.customId.split(' ').slice(2),
			});
		} else if (interaction.isStringSelectMenu()) {
			const command = client.commands.get(interaction.customId.split(' ')[0]);

			const player = await instance.database.player.findOne(interaction.user.id);
			player.stats.set('commands', player.stats.get('commands') + 1);
			player.save();

			await command.execute({
				guild: interaction.guild,
				interaction,
				instance,
				member: interaction.member,
				client,
				user: interaction.user,
				channel: interaction.channel,
				database: instance.database,
				subcommand: interaction.customId.split(' ')[1],
			});
		}
	},
};
