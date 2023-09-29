const math = require('mathjs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('math')
		.setNameLocalization('pt-BR', 'mat')
		.setDescription('Resolve a mathematical expression')
		.setDescriptionLocalization('pt-BR', 'Calcule uma expressão matemática')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('expression')
				.setNameLocalization('pt-BR', 'expressão')
				.setDescription('the mathematical expression to be solved')
				.setDescriptionLocalization('pt-BR', 'a expressão matemática a ser resolvida')
				.setRequired(true)
				.setAutocomplete(true)
		),
	execute: async ({ interaction, instance, member }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const text = interaction.options.getString('expression').replaceAll('**', '^');
			const answer = await math.evaluate(text).toString();

			const embed = instance.createEmbed(member.displayColor).addFields({
				name: instance.getMessage(interaction, 'RESULTADO'),
				value: answer,
			});

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error(`math: ${error}`);
			interaction.editReply({
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
