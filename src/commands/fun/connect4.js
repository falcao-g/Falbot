const { SlashCommandBuilder } = require('discord.js');
const { Connect4 } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect4')
		.setDescription('Play a game of connect4')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue um jogo de connect4',
			'es-ES': 'Juega un juego de connect4',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('opponent')
				.setNameLocalizations({
					'pt-BR': 'oponente',
					'es-ES': 'oponente',
				})
				.setDescription('opponent to play with')
				.setDescriptionLocalizations({
					'pt-BR': 'oponente para jogar',
					'es-ES': 'oponente para jugar',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new Connect4({
				message: interaction,
				isSlashGame: true,
				opponent: interaction.options.getUser('opponent'),
				embed: {
					title: 'Connect4',
					statusTitle: 'Status',
					color: '#6E0070',
				},
				emojis: {
					board: '⚪',
					player1: '🔴',
					player2: '🟡',
				},
				mentionUser: true,
				timeoutTime: 60000,
				buttonStyle: 'PRIMARY',
				turnMessage: instance.getMessage(interaction, 'FALGAMES_MOVE'),
				winMessage: instance.getMessage(interaction, 'FALGAMES_WIN'),
				tieMessage: instance.getMessage(interaction, 'FALGAMES_DRAW'),
				timeoutMessage: instance.getMessage(interaction, 'FALGAMES_TIMEOUT'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY_2'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`connect4: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
