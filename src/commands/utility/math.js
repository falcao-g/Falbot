const math = require('mathjs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('math')
		.setNameLocalizations({
			'pt-BR': 'mat',
			'es-ES': 'mat',
		})
		.setDescription('Resolve a mathematical expression')
		.setDescriptionLocalizations({
			'pt-BR': 'Resolva uma expressão matemática',
			'es-ES': 'Resuelve una expresión matemática',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('expression')
				.setNameLocalizations({
					'pt-BR': 'expressão',
					'es-ES': 'expresión',
				})
				.setDescription('the mathematical expression to be solved')
				.setDescriptionLocalizations({
					'pt-BR': 'a expressão matemática a ser resolvida',
					'es-ES': 'la expresión matemática a resolver',
				})
				.setRequired(true)
				.setAutocomplete(true)
		),
	execute: async ({ interaction, instance, member }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const text = interaction.options.getString('expression').replaceAll('**', '^');
			const answer = await math.evaluate(text).toString();

			const embed = instance.createEmbed(member.displayColor).addFields({
				name: instance.getMessage(interaction, 'RESULT'),
				value: answer,
			});

			await instance.editReply(interaction, { embeds: [embed] });
		} catch (error) {
			console.error(`math: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'MATH_ERROR'),
				embeds: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().replaceAll('**', '^');
		try {
			await interaction.respond([
				{
					name: `= ${await math.evaluate(focusedValue)}`,
					value: await math.evaluate(focusedValue).toString(),
				},
			]);
		} catch {
			await interaction.respond([
				{
					name: instance.getMessage(interaction, 'MATH_ERROR'),
					value: focusedValue,
				},
			]);
		}
	},
};
