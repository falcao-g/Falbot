const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const { msToTime, resolveCooldown } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cooldowns')
		.setNameLocalizations({
			'pt-BR': 'intervalos',
			'es-ES': 'intervalos',
		})
		.setDescription('Shows your commands cooldowns')
		.setDescriptionLocalizations({
			'pt-BR': 'Veja o tempo que falta para poder usar certos comandos',
			'es-ES': 'Muestra el tiempo que falta para poder usar ciertos comandos',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance, member, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const { lastVote } = await database.player.findOne(member.id);
			const voteCooldown = Date.now() - lastVote;
			const scratchCooldown = await resolveCooldown(member.id, 'scratch');
			const workCooldown = await resolveCooldown(member.id, 'work');
			const fishCooldown = await resolveCooldown(member.id, 'fish');
			const exploreCooldown = await resolveCooldown(member.id, 'explore');
			const mineCooldown = await resolveCooldown(member.id, 'mine');
			const huntCooldown = await resolveCooldown(member.id, 'hunt');
			const lotto = await instance.lottoSchema.findById('weekly');

			var events = `**${instance.getMessage(interaction, 'LOTTERY')}** - ${instance.getMessage(
				interaction,
				'LOTTERY_DRAWN',
				{
					TIME: msToTime(lotto.nextDraw - Date.now()),
				}
			)}`;

			events += instance.randomEvents.stringifyActives(interaction); // Add active events

			const embed = instance
				.createEmbed(await instance.getUserDisplay('displayColor', member))
				.setTitle(instance.getMessage(interaction, 'COOLDOWNS'))
				.addFields(
					{
						name: ':ballot_box: ' + instance.getMessage(interaction, 'VOTE'),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':slot_machine: ' + instance.getMessage(interaction, 'SCRATCH'),
						value: `**${
							scratchCooldown > 0
								? `:red_circle: ${msToTime(scratchCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':briefcase: ' + instance.getMessage(interaction, 'WORK'),
						value: `**${
							workCooldown > 0
								? `:red_circle: ${msToTime(workCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':fishing_pole_and_fish: ' + instance.getMessage(interaction, 'FISH'),
						value: `**${
							fishCooldown > 0
								? `:red_circle: ${msToTime(fishCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':compass: ' + instance.getMessage(interaction, 'EXPLORE'),
						value: `**${
							exploreCooldown > 0
								? `:red_circle: ${msToTime(exploreCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':pick: ' + instance.getMessage(interaction, 'MINE'),
						value: `**${
							mineCooldown > 0
								? `:red_circle: ${msToTime(mineCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':crossed_swords: ' + instance.getMessage(interaction, 'HUNT'),
						value: `**${
							huntCooldown > 0
								? `:red_circle: ${msToTime(huntCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'READY')}`
						}**`,
						inline: true,
					},
					{
						name: ':loudspeaker: ' + instance.getMessage(interaction, 'EVENTS'),
						value: events,
						inline: false,
					}
				);

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('vote')
					.setEmoji('🗳️')
					.setStyle(voteCooldown < 43200000 ? 'Danger' : 'Success')
					.setDisabled(voteCooldown < 43200000 ? true : false),
				new ButtonBuilder()
					.setCustomId('scratch')
					.setEmoji('🎰')
					.setStyle(scratchCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(scratchCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId('work')
					.setEmoji('💼')
					.setStyle(workCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(workCooldown ? true : false),
			]);

			const row2 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('fish')
					.setEmoji('🎣')
					.setStyle(fishCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(fishCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId('explore')
					.setEmoji('🧭')
					.setStyle(exploreCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(exploreCooldown ? true : false),
				new ButtonBuilder()
					.setCustomId('mine')
					.setEmoji('⛏️')
					.setStyle(mineCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(mineCooldown ? true : false),
			]);

			const row3 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('hunt')
					.setEmoji('⚔️')
					.setStyle(huntCooldown > 0 ? 'Danger' : 'Success')
					.setDisabled(huntCooldown ? true : false),
			]);

			instance.editReply(interaction, { embeds: [embed], components: [row, row2, row3] });
		} catch (error) {
			console.error(`cooldowns: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
