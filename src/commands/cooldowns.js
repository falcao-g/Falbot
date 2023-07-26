const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const { readFile, msToTime, resolveCooldown } = require('../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cooldowns')
		.setNameLocalization('pt-BR', 'intervalos')
		.setDescription('Shows your commands cooldowns')
		.setDescriptionLocalization('pt-BR', 'Veja o tempo que falta para poder usar certos comandos')
		.setDMPermission(false),
	execute: async ({ interaction, instance, member }) => {
		await interaction.deferReply();
		try {
			const voteCooldown = Date.now() - (await readFile(member.id, 'lastVote'));
			const scratchCooldown = await resolveCooldown(member.id, 'scratch');
			const workCooldown = await resolveCooldown(member.id, 'work');
			const fishCooldown = await resolveCooldown(member.id, 'fish');
			const exploreCooldown = await resolveCooldown(member.id, 'explore');
			const mineCooldown = await resolveCooldown(member.id, 'mine');
			const huntCooldown = await resolveCooldown(member.id, 'hunt');
			const lotto = await instance.lottoSchema.findById('semanal');
			const embed = instance
				.createEmbed({ member })
				.setTitle(instance.getMessage(interaction, 'COOLDOWNS'))
				.addFields(
					{
						name: ':ballot_box: ' + instance.getMessage(interaction, 'VOTO'),
						value: `**${
							voteCooldown < 43200000
								? `:red_circle: ${msToTime(43200000 - voteCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':slot_machine: ' + instance.getMessage(interaction, 'SCRATCH'),
						value: `**${
							scratchCooldown > 0
								? `:red_circle: ${msToTime(scratchCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':briefcase: ' + instance.getMessage(interaction, 'TRABALHO'),
						value: `**${
							workCooldown > 0
								? `:red_circle: ${msToTime(workCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':fishing_pole_and_fish: ' + instance.getMessage(interaction, 'FISH'),
						value: `**${
							fishCooldown > 0
								? `:red_circle: ${msToTime(fishCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':compass: ' + instance.getMessage(interaction, 'EXPLORE'),
						value: `**${
							exploreCooldown > 0
								? `:red_circle: ${msToTime(exploreCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':pick: ' + instance.getMessage(interaction, 'MINE'),
						value: `**${
							mineCooldown > 0
								? `:red_circle: ${msToTime(mineCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':crossed_swords: ' + instance.getMessage(interaction, 'HUNT'),
						value: `**${
							huntCooldown > 0
								? `:red_circle: ${msToTime(huntCooldown)}`
								: `:green_circle: ${instance.getMessage(interaction, 'PRONTO')}`
						}**`,
						inline: true,
					},
					{
						name: ':loudspeaker: ' + instance.getMessage(interaction, 'EVENTS'),
						value: `**${instance.getMessage(interaction, 'LOTTERY')}** - ${instance.getMessage(
							interaction,
							'LOTTERY_DRAWN',
							{
								TIME: msToTime(lotto.nextDraw - Date.now()),
							}
						)}`,
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

			interaction.editReply({ embeds: [embed], components: [row, row2, row3] });
		} catch (error) {
			console.error(`cooldowns: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
